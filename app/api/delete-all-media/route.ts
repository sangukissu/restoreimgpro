import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { deleteImageFromR2, deleteVideoFromR2 } from "@/lib/r2";

export async function DELETE() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Track deletion results
    const deletionResults = {
      videoGenerations: 0,
      imageRestorations: 0,
      familyPortraits: 0,
      addPersonGenerations: 0,
      removePersonGenerations: 0,
      nostalgicHugGenerations: 0,
      storageFiles: 0,
      r2Videos: 0,
      r2Images: 0,
      storageErrors: [] as string[],
      r2Errors: [] as string[]
    };

    // 1. Fetch data to identify external resources to delete

    // Get image restorations
    const { data: imageRestorations, error: fetchImageError } = await supabase
      .from("image_restorations")
      .select("restored_image_url")
      .eq("user_id", user.id);

    if (fetchImageError) {
      console.error("Error fetching image restorations:", fetchImageError);
    }

    // Get family portraits
    const { data: familyPortraits, error: fetchPortraitError } = await supabase
      .from("family_portraits")
      .select("composed_image_url")
      .eq("user_id", user.id);

    if (fetchPortraitError) {
      console.error("Error fetching family portraits:", fetchPortraitError);
    }

    // Get add person generations
    const { data: addPersonGenerations, error: fetchAddPersonError } = await supabase
      .from("add_person_generations")
      .select("composed_image_url")
      .eq("user_id", user.id);

    if (fetchAddPersonError) {
      console.error("Error fetching add person generations:", fetchAddPersonError);
    }

    // Get remove person generations
    const { data: removePersonGenerations, error: fetchRemovePersonError } = await supabase
      .from("remove_person_generations")
      .select("result_image_url")
      .eq("user_id", user.id);

    if (fetchRemovePersonError) {
      console.error("Error fetching remove person generations:", fetchRemovePersonError);
    }

    // Get video generations
    const { data: videoGenerations, error: fetchVideoError } = await supabase
      .from("video_generations")
      .select("video_url")
      .eq("user_id", user.id)
      .not("video_url", "is", null);

    if (fetchVideoError) {
      console.error("Error fetching video generations:", fetchVideoError);
    }

    // Get nostalgic hug generations
    const { data: nostalgicHugGenerations, error: fetchHugError } = await supabase
      .from("nostalgic_hug_generations")
      .select("video_url")
      .eq("user_id", user.id)
      .not("video_url", "is", null);

    if (fetchHugError) {
      console.error("Error fetching nostalgic hug generations:", fetchHugError);
    }

    // 2. Delete Supabase Storage files (restored_photos bucket)
    // This bucket is used by both image_restorations and family_portraits
    // We can list all files in the user's folder and delete them

    try {
      const { data: userFiles, error: listError } = await supabase.storage
        .from('restored_photos')
        .list(user.id, {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error("Error listing user files:", listError);
        // Fallback handled below if needed, but listing error usually means bucket access issue
      } else if (userFiles && userFiles.length > 0) {
        // Delete all files in the user's folder
        const filePaths = userFiles.map(file => `${user.id}/${file.name}`);

        const { error: bulkDeleteError } = await supabase.storage
          .from('restored_photos')
          .remove(filePaths);

        if (bulkDeleteError) {
          console.error("Error bulk deleting storage files:", bulkDeleteError);
          deletionResults.storageErrors.push(`Bulk delete failed: ${bulkDeleteError.message}`);
        } else {
          deletionResults.storageFiles = filePaths.length;
        }
      }
    } catch (storageErr) {
      console.error("Unexpected error in storage deletion:", storageErr);
      deletionResults.storageErrors.push("Unexpected storage deletion error");
    }

    // 3. Delete R2 images
    // Generated image outputs are stored as R2 keys like
    // "images/{userId}/{timestamp}-{filename}". Legacy Supabase public URLs are
    // ignored here and are handled by the restored_photos bucket cleanup above.

    const imagesToDelete = [
      ...(imageRestorations?.map(v => v.restored_image_url) || []),
      ...(familyPortraits?.map(v => v.composed_image_url) || []),
      ...(addPersonGenerations?.map(v => v.composed_image_url) || []),
      ...(removePersonGenerations?.map(v => v.result_image_url) || [])
    ].filter((key): key is string => typeof key === "string" && key.startsWith("images/"));

    if (imagesToDelete.length > 0) {
      for (const imageKey of imagesToDelete) {
        try {
          await deleteImageFromR2(imageKey);
          deletionResults.r2Images++;
        } catch (r2Error) {
          console.error(`Error deleting image from R2: ${imageKey}`, r2Error);
          deletionResults.r2Errors.push(`${imageKey}: ${r2Error instanceof Error ? r2Error.message : 'Unknown error'}`);
        }
      }
    }

    // 4. Delete R2 videos
    // This includes video_generations and nostalgic_hug_generations
    // Note: video_url now contains R2 keys like "videos/{userId}/{timestamp}-{filename}"

    const videosToDelete = [
      ...(videoGenerations?.map(v => v.video_url) || []),
      ...(nostalgicHugGenerations?.map(v => v.video_url) || [])
    ];

    if (videosToDelete.length > 0) {
      for (const videoKey of videosToDelete) {
        if (videoKey) {
          try {
            await deleteVideoFromR2(videoKey);
            deletionResults.r2Videos++;
          } catch (r2Error) {
            console.error(`Error deleting video from R2: ${videoKey}`, r2Error);
            deletionResults.r2Errors.push(`${videoKey}: ${r2Error instanceof Error ? r2Error.message : 'Unknown error'}`);
          }
        }
      }
    }

    // 5. Delete Database Records

    // Delete video generations
    const { error: videoDeleteError, count: videoCount } = await supabase
      .from("video_generations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (videoDeleteError) {
      console.error("Error deleting video generations:", videoDeleteError);
    } else {
      deletionResults.videoGenerations = videoCount || 0;
    }

    // Delete image restorations
    const { error: imageDeleteError, count: imageCount } = await supabase
      .from("image_restorations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (imageDeleteError) {
      console.error("Error deleting image restorations:", imageDeleteError);
    } else {
      deletionResults.imageRestorations = imageCount || 0;
    }

    // Delete family portraits
    const { error: portraitDeleteError, count: portraitCount } = await supabase
      .from("family_portraits")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (portraitDeleteError) {
      console.error("Error deleting family portraits:", portraitDeleteError);
    } else {
      deletionResults.familyPortraits = portraitCount || 0;
    }

    // Delete add person generations
    const { error: addPersonDeleteError, count: addPersonCount } = await supabase
      .from("add_person_generations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (addPersonDeleteError) {
      console.error("Error deleting add person generations:", addPersonDeleteError);
    } else {
      deletionResults.addPersonGenerations = addPersonCount || 0;
    }

    // Delete remove person generations
    const { error: removePersonDeleteError, count: removePersonCount } = await supabase
      .from("remove_person_generations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (removePersonDeleteError) {
      console.error("Error deleting remove person generations:", removePersonDeleteError);
    } else {
      deletionResults.removePersonGenerations = removePersonCount || 0;
    }

    // Delete nostalgic hug generations
    const { error: hugDeleteError, count: hugCount } = await supabase
      .from("nostalgic_hug_generations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (hugDeleteError) {
      console.error("Error deleting nostalgic hug generations:", hugDeleteError);
    } else {
      deletionResults.nostalgicHugGenerations = hugCount || 0;
    }

    // Return success response with detailed results
    return NextResponse.json(
      {
        message: "All media deleted successfully",
        deletedTables: ["video_generations", "image_restorations", "family_portraits", "add_person_generations", "remove_person_generations", "nostalgic_hug_generations"],
        deletionResults: {
          videoGenerations: deletionResults.videoGenerations,
          imageRestorations: deletionResults.imageRestorations,
          familyPortraits: deletionResults.familyPortraits,
          addPersonGenerations: deletionResults.addPersonGenerations,
          removePersonGenerations: deletionResults.removePersonGenerations,
          nostalgicHugGenerations: deletionResults.nostalgicHugGenerations,
          storageFiles: deletionResults.storageFiles,
          r2Videos: deletionResults.r2Videos,
          r2Images: deletionResults.r2Images,
          storageErrors: deletionResults.storageErrors.length > 0 ? deletionResults.storageErrors : undefined,
          r2Errors: deletionResults.r2Errors.length > 0 ? deletionResults.r2Errors : undefined
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error in delete-all-media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
