import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

// Infer Dodo Payments base URL by environment
function getDodoBaseURL() {
  const mode = (process.env.DODO_ENV || "").toLowerCase();
  // Prefer explicit test flag
  if (mode === "test" || mode === "testing" || mode === "sandbox") {
    return "https://test.dodopayments.com";
  }
  // Fallback: if running locally, default to test
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  if (appUrl.includes("localhost") || appUrl.includes("127.0.0.1")) {
    return "https://test.dodopayments.com";
  }
  return "https://live.dodopayments.com";
}

// Basic country detection from edge providers (Vercel/CF)
function getCountryFromHeaders(req: NextRequest) {
  return (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    "ZZ"
  ).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DODO_PAYMENTS_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const appURL = process.env.NEXT_PUBLIC_APP_URL;
    if (!appURL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured" },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Inputs
    const body = await request.json().catch(() => ({} as any));
    const selectedPlanId =
      typeof body?.planId === "string" ? body.planId.trim() : "";
    if (!selectedPlanId) {
      return NextResponse.json({ error: "planId is required" }, { status: 400 });
    }

    // Load plan
    const { data: plan, error: planError } = await supabase
      .from("payment_plans")
      .select("*")
      .eq("id", selectedPlanId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "Selected plan not found" },
        { status: 404 }
      );
    }

    // Validate product configuration
    if (
      !plan.dodo_product_id ||
      [
        "your_dodo_product_id_here",
        "REPLACE_ME",
        "REPLACE_WITH_PLUS_DODO_PRODUCT_ID",
        "REPLACE_WITH_STARTER_DODO_PRODUCT_ID",
        "",
      ].includes(plan.dodo_product_id)
    ) {
      return NextResponse.json(
        { error: "Invalid product configuration for selected plan" },
        { status: 400 }
      );
    }

    const country = getCountryFromHeaders(request);
    const attemptId = crypto.randomUUID();

    const baseURL = getDodoBaseURL();

    // Build Checkout Session payload (per docs)
    // References:
    // - Create Checkout Session: https://docs.dodopayments.com/api-reference/checkout-sessions/create
    // - Payment methods: https://docs.dodopayments.com/features/payment-methods
    const payload: Record<string, any> = {
      product_cart: [
        {
          product_id: plan.dodo_product_id,
          quantity: 1,
        },
      ],
      return_url: `${appURL}/dashboard?payment=success`,
      cancel_url: `${appURL}/dashboard?checkout=cancelled&attempt=${attemptId}`,
      // Collect customer and billing on hosted checkout (no prefill)
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        credits: String(plan.credits),
        amount_cents: String(plan.price_cents),
        region_country: country,
        checkout_attempt_id: attemptId,
      },
      // Do not pre-apply any discount code from site; enable entry on hosted checkout via feature_flags below
      // Enable hosted page inputs; keep flags to supported minimal set per docs
      // Optionally enforce SCA in higher-risk scenarios:
      // force_3ds: true,
    };

    const resp = await fetch(`${baseURL}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
      console.error("Dodo checkout session create failed", resp.status, errorText, "payload:", payload);
      return NextResponse.json(
        {
          error: "Failed to create checkout session",
          details: errorText || `HTTP ${resp.status}`,
        },
        { status: 500 }
      );
    }

    const session = await resp.json().catch(() => ({}));
    const id = session.id || session.session_id || session.sessionId;
    const url = session.url || session.checkout_url || session.payment_link;

    if (!id || !url) {
      return NextResponse.json(
        { error: "Malformed response from Dodo Payments (missing id or url)" },
        { status: 500 }
      );
    }

    const { error: attemptError } = await supabaseAdmin.from("checkout_attempts").insert({
      id: attemptId,
      user_id: user.id,
      session_id: id,
      plan_id: plan.id,
      price_cents: plan.price_cents,
      country_code: country,
    });
    // Checkout must remain available if tracking has a temporary outage.
    if (attemptError) console.error("Failed to save checkout attempt", attemptError);

    return NextResponse.json({ id, url });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
