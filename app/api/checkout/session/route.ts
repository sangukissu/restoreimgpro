import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Infer Dodo Payments base URL by environment
function getDodoBaseURL() {
  const mode = (process.env.DODO_ENV || "").toLowerCase();
  if (mode === "test" || mode === "testing" || mode === "sandbox") {
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
    "US"
  ).toUpperCase();
}

// Resolve region-specific payment method preferences
function resolveAllowedPaymentMethods(countryCode: string): string[] {
  const defaults = ["credit", "debit", "apple_pay", "google_pay"];

  // India: UPI support (collect/intent)
  if (countryCode === "IN") {
    return [...defaults, "upi_collect", "upi_intent"];
  }

  // EU localized methods (note: often EUR-only and one-time only)
  if (["NL", "BE", "PL", "AT"].includes(countryCode)) {
    const euMap: Record<string, string[]> = {
      NL: ["ideal"],
      BE: ["bancontact"],
      PL: ["p24"],
      AT: ["eps"],
    };
    return [...defaults, ...(euMap[countryCode] || [])];
  }

  // Default global
  return defaults;
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
    const allowed_payment_method_types = resolveAllowedPaymentMethods(country);

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
      success_url: `${appURL}/dashboard?payment=success`,
      cancel_url: `${appURL}/dashboard?payment=cancelled`,
      customer: {
        email: user.email || "",
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
      },
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        credits: String(plan.credits),
        amount_cents: String(plan.price_cents),
        region_country: country,
      },
      feature_flags: {
        allow_currency_selection: true,
        show_order_details: true,
      },
      allowed_payment_method_types,
      // Optionally enforce SCA in higher-risk scenarios:
      // force_3ds: true,
    };

    const resp = await fetch(`${baseURL}/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
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

    // Note: We skip DB insert here and rely on webhooks for authoritative state.
    // If desired, you could insert a pending record keyed by session id.

    return NextResponse.json({ id, url });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
