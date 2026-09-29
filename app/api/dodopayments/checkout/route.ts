import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

// Infer Dodo Payments base URL by environment
function getDodoBaseURL() {
    const mode = (process.env.DODO_ENV || "").toLowerCase();
    if (mode === "test" || mode === "testing" || mode === "sandbox") {
        return "https://test.dodopayments.com";
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    if (appUrl.includes("localhost") || appUrl.includes("127.0.0.1")) {
        return "https://test.dodopayments.com";
    }
    return "https://live.dodopayments.com";
}

// GET /api/dodopayments/checkout?session_id=cs_xxx
// Fetches checkout session status/details from Dodo Payments
export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "DODO_PAYMENTS_API_KEY is not configured on the server" },
                { status: 500 }
            );
        }

        const url = new URL(request.url);
        const sessionId = url.searchParams.get("session_id") || url.searchParams.get("id");

        if (!sessionId) {
            return NextResponse.json(
                { error: "session_id query param is required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { data: attempt } = await supabaseAdmin
            .from("checkout_attempts")
            .select("id, completed_at")
            .eq("session_id", sessionId)
            .eq("user_id", user.id)
            .maybeSingle();
        if (!attempt) return NextResponse.json({ error: "Checkout not found" }, { status: 404 });
        if (attempt.completed_at) {
            return NextResponse.json({ payment_status: "succeeded", completed: true });
        }

        const baseURL = getDodoBaseURL();

        // Docs (Context7): Get Checkout Session
        // https://docs.dodopayments.com/api-reference/checkout-sessions/get-checkouts
        const resp = await fetch(`${baseURL}/checkouts/${encodeURIComponent(sessionId)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            return NextResponse.json(
                {
                    error: "Failed to retrieve checkout session",
                    details: text || `HTTP ${resp.status}`,
                },
                { status: 502 }
            );
        }

        const session = await resp.json().catch(() => ({}));
        return NextResponse.json({
            payment_status: session.payment_status ?? null,
            completed: Boolean(attempt.completed_at),
        });
    } catch (err) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
