import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";
import { getR2ObjectBuffer, getR2ObjectStream } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Node runtime for streaming

export async function GET(request: Request) {
    try {
        // 1. Authenticate user
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get and validate key parameter
        const url = new URL(request.url);
        const key = url.searchParams.get("key");
        const requestedWidth = Number(url.searchParams.get("width"));
        const width =
            requestedWidth === 320 || requestedWidth === 640
                ? requestedWidth
                : null;

        if (!key) {
            return NextResponse.json({ error: "Missing 'key' query parameter" }, { status: 400 });
        }

        // 3. Security check: ensure image key belongs to this user
        // Images are stored with path: images/{userId}/{timestamp}-{filename}
        if (!key.includes(user.id)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (width) {
            const { body } = await getR2ObjectBuffer(key);
            const resized = await sharp(body, { failOn: "none" })
                .rotate()
                .resize({ width, withoutEnlargement: true })
                .webp({ quality: width === 320 ? 72 : 80 })
                .toBuffer();

            return new Response(new Uint8Array(resized), {
                headers: {
                    "Content-Type": "image/webp",
                    "Content-Length": String(resized.byteLength),
                    "Cache-Control": "private, max-age=31536000, immutable",
                    "Vary": "Cookie",
                },
            });
        }

        // 4. Stream the original image from R2
        const { body, contentType, contentLength, lastModified } = await getR2ObjectStream(key);

        const headers: Record<string, string> = {
            "Content-Type": contentType || "image/png",
            "Cache-Control": "private, max-age=31536000", // Cache for 1 year
        };

        if (contentLength) headers["Content-Length"] = String(contentLength);
        if (lastModified) headers["Last-Modified"] = lastModified;

        // Return image stream
        return new Response(body as any, { headers });

    } catch (err: any) {
        const code = err?.$metadata?.httpStatusCode || 500;
        const message = err?.name === "NoSuchKey" || code === 404 ? "Image not found" : "Internal server error";
        const status = message === "Image not found" ? 404 : 500;

        console.error("image-proxy error", { err });
        return NextResponse.json({ error: message }, { status });
    }
}
