import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Part } from '@google/genai';
import mime from 'mime';

// Initialize Google AI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Function to fetch image from URL and convert to a GenerativeAI Part
async function urlToGenerativePart(url: string): Promise<Part> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || mime.getType(url);

    if (!contentType) {
      throw new Error('Could not determine content type of the image.');
    }

    return {
      inlineData: {
        data: Buffer.from(buffer).toString('base64'),
        mimeType: contentType,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  const reqStart = Date.now()
  try {
    const body = await req.json();
    const restoredUrl: string | undefined = body?.restoredUrl || body?.imageUrl; // support old clients
    const originalUrl: string | undefined = body?.originalUrl;

    if (!restoredUrl || typeof restoredUrl !== 'string') {
      return NextResponse.json({ error: 'restoredUrl is required' }, { status: 400 });
    }

    const imagePart = await urlToGenerativePart(restoredUrl);

    const prompt = `Review the restored image and decide if the remaining damage is so severe that the customer would likely request a refund or complain and output STRICT JSON ONLY.\n
Definitions:\n
- structural_damage: physical or age-related defects such as tears, scratches, rips, creases/folds, stains/water damage, mold/mildew, large dark or colorized spots/blotches, burn marks, holes, cracks, severe discoloration/color bleeding. These are the focus.\n
- non_structural_quality: minor grain/noise, mild blur, typical compression artifacts, natural texture loss, slight banding; these should be largely IGNORED unless extreme and obviously resembling structural_damage.\n
Return keys:\n
- overall_quality_score: number (0-100) where 100 = no structural_damage visible; THIS SCORE MUST NOT penalize minor non_structural_quality issues.\n- confidence: number (0-1) indicating your confidence in the assessment.\n- damage_categories: array of { name: string; severity: number (0-1); confidence: number (0-1); notes?: string } listing ONLY structural_damage types you see \n- recommended_second_pass_prompt: string (one concise prompt focused on removing remaining structural_damage conservatively while preserving facial and character identity).\n
Guidance:\n
- Exclude minor noise, mild blur, and typical compression artifacts from scoring and categories.\n- Include a damage category only if it is clearly visible; set severity by its prominence/coverage (e.g., large stain across face = high severity).\n- The recommended_second_pass_prompt MUST: preserve the original subject’s identity, facial features, and character consistency; avoid altering age, gender, facial structure, or distinctive marks; reduce structural damages non-destructively; keep skin texture natural (no plastic look); prevent over-sharpening halos and unnatural smoothing; keep background details intact; avoid hallucinations and new elements; be a single, succinct command.\n- Output ONLY JSON. No preface or markdown. Example:\n{"overall_quality_score": 92, "confidence": 0.85, "damage_categories": [{"name":"stain/water_damage", "severity":0.6, "confidence":0.8}], "recommended_second_pass_prompt": "Carefully reduce remaining stains and water damage without altering the subject’s identity; avoid plastic smoothing and halos; preserve natural textures."}`

    const genStart = Date.now()
    const result = await genAI.models.generateContent({
      contents: [
        { text: prompt },
        imagePart,
      ],
      model: 'gemini-flash-lite-latest',
    });
    const genMs = Date.now() - genStart

    const responseText =
      (result as any).text ??
      result.candidates?.[0]?.content?.parts?.find((p: any) => p?.text)?.text;

    if (!responseText || typeof responseText !== 'string') {
      return NextResponse.json({ error: 'Model did not return text output' }, { status: 502 });
    }

    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse analysis JSON', details: cleaned.slice(0, 300) }, { status: 502 });
    }

    // Validate minimal schema
    const oqs = Number(parsed.overall_quality_score);
    const conf = Number(parsed.confidence);
    const rsp = parsed.recommended_second_pass_prompt;

    if (!Number.isFinite(oqs) || oqs < 0 || oqs > 100 || !Number.isFinite(conf) || conf < 0 || conf > 1 || typeof rsp !== 'string') {
      console.warn('[analyze-image] 502 schema validation failed:', { oqs, conf, rspType: typeof rsp })
      return NextResponse.json({ error: 'Analysis schema validation failed' }, { status: 502 });
    }

    const damage_categories = Array.isArray(parsed.damage_categories) ? parsed.damage_categories : [];

    // Thresholding & gating (focus strictly on structural damages)
    const structuralKeywords = ['tear','scratch','rip','crease','fold','stain','water','mold','mildew','spot','blotch','discoloration','color bleed','burn','hole','crack'];
    const structuralFindings = damage_categories.filter((c: any) => {
      const name = (c?.name ?? '').toString().toLowerCase();
      const isStructural = structuralKeywords.some(k => name.includes(k));
      const sev = Number(c?.severity);
      const cconf = Number(c?.confidence);
      return isStructural && Number.isFinite(sev) && Number.isFinite(cconf) && sev >= 0.4 && cconf >= 0.6;
    });
    const maxStructuralSeverity = structuralFindings.reduce((m: number, c: any) => Math.max(m, Number(c?.severity ?? 0)), 0);
    const heavyStructural = maxStructuralSeverity >= 0.6;

    const confidenceThreshold = 0.65;
    const shouldRerestore = heavyStructural && conf >= confidenceThreshold;

    const topNames = structuralFindings.map((c: any) => String(c?.name ?? '')).slice(0, 3);
    const reason = shouldRerestore
      ? `Visible structural damage remains (${topNames.join(', ') || 'e.g., tear/scratch, stain/water'}). A second pass may reduce these issues without altering identity.`
      : 'No significant structural damage detected; minor noise/blur/compression are acceptable. No second pass recommended.';

    const resPayload = {
      analysis: {
        overall_quality_score: oqs,
        confidence: conf,
        damage_categories,
        recommended_second_pass_prompt: rsp,
      },
      shouldRerestore,
      reason,
    }

    const totalMs = Date.now() - reqStart
    // Removed noisy debug log for production readiness
    return NextResponse.json(resPayload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[analyze-image] 500 route error:', message)
    return NextResponse.json({ error: 'Failed to analyze image', details: message }, { status: 500 });
  }
}