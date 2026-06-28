import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromR2 } from "@/lib/r2";
import { createClient } from "@/utils/supabase/server";

const imageSources = {
  restoration: {
    table: "image_restorations",
    urlColumn: "restored_image_url",
  },
  "family-portrait": {
    table: "family_portraits",
    urlColumn: "composed_image_url",
  },
  "add-person": {
    table: "add_person_generations",
    urlColumn: "composed_image_url",
  },
  "remove-person": {
    table: "remove_person_generations",
    urlColumn: "result_image_url",
  },
} as const;

type ImageSourceType = keyof typeof imageSources;

function isImageSourceType(value: unknown): value is ImageSourceType {
  return typeof value === "string" && value in imageSources;
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id = typeof body?.id === "string" ? body.id : "";
    const sourceType = body?.sourceType;

    if (!id || !isImageSourceType(sourceType)) {
      return NextResponse.json({ error: "Invalid media item" }, { status: 400 });
    }

    const source = imageSources[sourceType];
    const { data: record, error: fetchError } = await supabase
      .from(source.table)
      .select(source.urlColumn)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    const imageKey = (record as Record<string, unknown>)[source.urlColumn];
    if (typeof imageKey === "string" && imageKey.startsWith("images/")) {
      await deleteImageFromR2(imageKey);
    }

    const { error: deleteError } = await supabase
      .from(source.table)
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting media item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete media item" },
      { status: 500 },
    );
  }
}
