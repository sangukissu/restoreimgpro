import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

const reasons = new Set([
  "too_expensive", "unsure_results", "trust", "payment_issue",
  "payment_method", "not_ready", "other",
]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const attemptId = typeof body?.attemptId === "string" ? body.attemptId : "";
  const reason = typeof body?.reason === "string" ? body.reason : "";
  const note = typeof body?.note === "string" ? body.note.trim() : "";

  if (!/^[0-9a-f-]{36}$/i.test(attemptId) || !reasons.has(reason) || note.length > 500) {
    return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("checkout_attempts")
    .update({ exit_reason: reason, exit_note: note || null, feedback_at: new Date().toISOString() })
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .is("feedback_at", null)
    .select("id");

  if (error) return NextResponse.json({ error: "Could not save feedback" }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "Checkout attempt not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
