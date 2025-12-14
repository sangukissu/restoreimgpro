import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getR2ObjectStream } from "@/lib/r2";

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

        if (!key) {
            return NextResponse.json({ error: "Missing 'key' query parameter" }, { status: 400 });
        }

        // 3. Security check: ensure video key belongs to this user
        // Videos are stored with path: videos/{userId}/{timestamp}-{filename}
        if (!key.includes(user.id)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 4. Stream video from R2
        const { body, contentType, contentLength, lastModified } = await getR2ObjectStream(key);

        const headers: Record<string, string> = {
            "Content-Type": contentType || "video/mp4",
            "Cache-Control": "private, max-age=3600",
            "Accept-Ranges": "bytes",
        };

        if (contentLength) headers["Content-Length"] = String(contentLength);
        if (lastModified) headers["Last-Modified"] = lastModified;

        // Return video stream
        return new Response(body as any, { headers });

    } catch (err: any) {
        const code = err?.$metadata?.httpStatusCode || 500;
        const message = err?.name === "NoSuchKey" || code === 404 ? "Video not found" : "Internal server error";
        const status = message === "Video not found" ? 404 : 500;

        console.error("video-proxy error", { err });
        return NextResponse.json({ error: message }, { status });
    }
}
