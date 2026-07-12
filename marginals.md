# Reader's Marginalia — Final Plan

## Core Concept
Notes from family members are not overlaid on story pages or crammed into a bottom section. They become **actual pages in the book**, inserted after the last story spread and before the back cover. The book grows lived-in: handwritten messages from family on the contributor's own ink colour. The shared URL page stays clean — no scroll, no clutter. Just the book.

## User Flow
1. Reader opens the shared link, enters PIN, flips through the book.
2. After the last story page, they flip into note pages — handwritten messages from family, all on a single page. Once 1 page gets filled, the next note adds another page automatically.
3. After the note pages, the back cover closes the book.
4. When the book is fully closed (reader has flipped past the back cover, i.e. `pageIndex === maxIndex`), a hairline text button fades in at the bottom-right corner of the viewer: `+ leave a note`.
5. Clicking opens a **modal** — just a name field and a message field. No emojis, no reaction picker, no card chrome.
6. On submit, the modal closes and the note is saved. The sheets rebuild to include the new note on the existing page (or a new page if the current one is full). If the host adds more photos later, story pages shift forward; notes always stay before the back cover.

## Sheet Architecture
```
sheets[0]:       front=cover,     back=inner
sheets[1..N]:    front=story,     back=inner
sheets[N+1..M]:  front=notePage,  back=inner  (except last note sheet)
sheets[last note]: front=notePage, back=backCover
```
If no notes exist: last story sheet's back = backCover (original behavior).
No separate back-cover sheet — the back cover lives on the back of the last note sheet (or last story sheet if no notes). This eliminates the extra flower page.

## Note Page Layout
Notes use the **full page width** via two asymmetric columns (real scrapbook margins), not a single narrow column. Layout is packed greedily: short notes fill both columns; a long note may span a full column or even a full page. Notes never split across pages.

- **Two-column layout**: notes are packed into pages in reading order: left column fills top-to-bottom, then right column. The page renders them as two columns with an 8% gutter.
- **Packing algorithm**: estimate each note's wrapped height (name line + message lines at 1.15 line-height + date line + 22px gap). Fill the left column until the next note won't fit; then fill the right column; then start a new page. The render split is at the natural midpoint of the packed array.
- **Single note on a page**: centred gently in the available space, slightly rotated, like a letter on an otherwise blank page.
- **Many short notes**: distributed across both columns, 4–6 per page.
- **Name**: smaller, lighter tint of the same ink (35% lightened), italic, not bold — like a faint signature.
- **Message**: full ink colour, larger patrick-hand, not bold — the main handwriting.
- **Date**: tiny Manrope uppercase, barely visible (22% opacity).
- No cards, no borders, no dividers — just handwritten text on the page.

## Phases

### Phase 1: Clean up the old marginalia approach — DONE
- Removed PageMarginalia, MarginMarker, MarginDrawer, NoteComposer, NoteSent
- Removed getPageMarginalia from FamilyHeritageViewer
- Removed marginalia prop from MemoryBookStoryPage
- marginalia.tsx stripped to: MarginaliaNote type, inkHex, rotationForId, lightenInk

### Phase 2: Build NotePage component — DONE
- MemoryBookNotePage accepts an array of notes (not a single note)
- Uses the same innerPage + scrapbookPage styling as story pages
- Patrick Hand font, not bold, natural weight (400)
- Name in lighter ink tint, message in full ink
- Each note slightly rotated, organic vertical flow

### Phase 3: Thread notes into FamilyHeritageViewer — DONE
- packNotesIntoPages() chunks notes into page arrays using a real height budget and two-column fill
- Notes prop added to FamilyHeritageViewer
- Last note sheet's back = backCover (no extra flower page)
- If no notes: last story sheet's back = backCover (original behavior)

### Phase 4: Build the modal composer — DONE
- Dialog modal with name + message fields
- No emojis, no reaction picker
- Hairline-bottom underline inputs, serif italic font
- Submit button: "Add to the book →"

### Phase 5: Rewrite public-memory-book.tsx — DONE
- Clean: no scroll, no extra sections, just the viewer + the modal
- Fetch notes on mount
- Pass notes to FamilyHeritageViewer
- Hairline "+ leave a note" button appears when book is fully closed
- On submit: POST, close modal, add note to state (sheets rebuild)

### Phase 6: Simplify POST API — pending
- Remove reaction validation (default to "love" silently)
- Remove pageIndex (always null — notes go to end)
- Keep ink_color_key server-side hash
- Keep rate limiting

### Phase 7: Update owner panel — pending
- Keep the OwnerMarginaliaPanel but update copy
- Remove page_index references (notes are always end-of-book)
- Keep hide toggle