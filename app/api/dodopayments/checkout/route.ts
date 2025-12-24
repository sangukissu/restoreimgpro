import { NextResponse, type NextRequest } from "next/server";

// Infer Dodo Payments base URL by environment
function getDodoBaseURL() {
    const mode = (process.env.DODO_ENV || "").toLowerCase();
    if (mode === "test" || mode === "testing" || mode === "sandbox") {
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

        const baseURL = getDodoBaseURL();

        // Docs (Context7): Get Checkout Session
        // https://docs.dodopayments.com/api-reference/checkout-sessions/get-checkouts
        const resp = await fetch(`${baseURL}/checkout/sessions/${encodeURIComponent(sessionId)}`, {
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
        return NextResponse.json(session);
    } catch (err) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}