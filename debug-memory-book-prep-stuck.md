# Debug: memory-book-prep-stuck

## Status: [RESOLVED — user redirected to a different bug]

## Final Resolution

### Bug 1 (worker queue starvation) — FIXED
- 612 broken `generate_media_derivatives` jobs marked `dead`
- 23 orphan `preserve_asset` jobs (from deleted assets) marked `dead`
- `enqueueMemoryBookJob` in [server.ts:440](file:///d:/tutorial/2026/feb2026/restoreimgpro/lib/memory-book/server.ts#L440) changed from `.select("*")` to `.select("id")` to fix silent 406 errors
- `claim_memory_book_jobs` function updated to prioritize user-facing job types

### Bug 2 (one book per user) — FIXED
- Added partial unique index `uq_memory_books_one_draft_per_user` on `memory_books(user_id) WHERE status = 'draft'`
- Added API check in [route.ts:53-87](file:///d:/tutorial/2026/feb2026/restoreimgpro/app/api/memory-books/route.ts#L53-L87) that returns 409 with `existingBookId` if a draft or live book already exists

### Out of scope (not fixed)
- `enqueueLifecycleWork` still deletes books where `expires_at <= NOW()` regardless of `last_activity_at`. Active drafts should bump `expires_at` on every interaction. This is a known risk and recorded in project memory.

## Root Cause (confirmed)

The user's 5 `preserve_asset` jobs are being **starved by 625+ broken `generate_media_derivatives` jobs** that sit at the front of the queue.

### Evidence

**1. Queue state (live DB):**
- `generate_media_derivatives` queued: **625** (all with `available_at = 2026-06-20 08:36:23 UTC`, attempts=0, never claimed)
- `generate_media_derivatives` failed: 18
- `preserve_asset` queued: 48
- `delete_storage` queued: 8

**2. Claim function works correctly:**
- Manually called `claim_memory_book_jobs('test-worker-debug', 5)` → returned 5 rows, set to `status='running'`, `attempts=1`
- So the claim mechanism is **not broken**

**3. The starvation:**
- `claim_memory_book_jobs` orders by `available_at, created_at` (oldest first)
- The 625 derivative jobs have `available_at = 2026-06-20` (10 days in the past)
- The user's 5 preserve_asset jobs have `available_at` from a few minutes ago
- Every worker call claims 5 derivative jobs → they fail → marked failed with future retry → next call claims next 5
- The user's jobs never get reached because 625 derivative jobs must fail first
- Most derivative jobs have `book_id=NULL, asset_id=NULL` — they're for the global media library, not the memory book

**4. Secondary bug — silent 406 errors:**
- Supabase logs show `POST 406` on `memory_book_jobs?on_conflict=idempotency_key&select=*`
- This is `enqueueMemoryBookJob` in `lib/memory-book/server.ts:440`
- `.upsert(..., { onConflict, ignoreDuplicates: true }).select("*").maybeSingle()`
- When `ignoreDuplicates: true` and all rows are conflicts, PostgREST returns 0 rows. The `.select("*")` in the JS client then fails with 406.
- This is happening 15x per page load (once per media item) for `ensureCuratorMediaDerivatives`
- These failures are silently swallowed, so the user never sees them
- The user's 5 jobs ARE being created successfully (different code path), so the 406 doesn't directly block their jobs

## Fix Plan

### Fix 1 (immediate — unblocks the user)
Mark all `generate_media_derivatives` jobs that have `attempts=0` and `available_at < now() - 1 hour` as `dead`. They're from other users' abandoned sessions, and they're starving the user's queue.

### Fix 2 (correctness — prevent recurrence)
Change `enqueueMemoryBookJob` in `lib/memory-book/server.ts:440` from:
```ts
.upsert(..., { onConflict: "idempotency_key", ignoreDuplicates: true })
.select("*")
.maybeSingle()
```
to:
```ts
.upsert(..., { onConflict: "idempotency_key", ignoreDuplicates: true })
.select("id")
.maybeSingle()
```

### Fix 3 (prevention — priority for user jobs)
Modify the claim function to prefer the current user's `preserve_asset` jobs before processing global maintenance jobs. This ensures user-facing work isn't blocked by background jobs.
