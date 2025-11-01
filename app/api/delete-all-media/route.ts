import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { deleteVideoFromBlob } from "@/lib/vercel-blob";

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
      storageFiles: 0,
      blobVideos: 0,
      storageErrors: [] as string[],
      blobErrors: [] as string[]
    };

    // First, get all image restorations to identify storage files to delete
    const { data: imageRestorations, error: fetchError } = await supabase
      .from("image_restorations")
      .select("restored_image_url")
      .eq("user_id", user.id);

    if (fetchError) {
      console.error("Error fetching image restorations:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch image restorations" },
        { status: 500 }
      );
    }

    // Delete storage files from restored_photos bucket
    if (imageRestorations && imageRestorations.length > 0) {
      // Alternative approach: List all files in user's folder and delete them
      // This is more efficient for users with many files
      const { data: userFiles, error: listError } = await supabase.storage
        .from('restored_photos')
        .list(user.id, {
          limit: 1000, // Adjust limit as needed
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error("Error listing user files:", listError);
        // Fall back to individual file deletion
      } else if (userFiles && userFiles.length > 0) {
        // Delete all files in the user's folder
        const filePaths = userFiles.map(file => `${user.id}/${file.name}`);
        
        const { error: bulkDeleteError } = await supabase.storage
          .from('restored_photos')
          .remove(filePaths);

        if (bulkDeleteError) {
          console.error("Error bulk deleting storage files:", bulkDeleteError);
          deletionResults.storageErrors.push(`Bulk delete failed: ${bulkDeleteError.message}`);
          
          // Fall back to individual file deletion
          for (const restoration of imageRestorations) {
            if (restoration.restored_image_url) {
              try {
                // Extract file path from the URL
                // URLs are typically: https://[project].supabase.co/storage/v1/object/public/restored_photos/[user_id]/[filename]
                const url = new URL(restoration.restored_image_url);
                const pathParts = url.pathname.split('/');
                
                // Find the bucket name and file path
                const bucketIndex = pathParts.indexOf('restored_photos');
                if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
                  // Get the file path after the bucket name
                  const filePath = pathParts.slice(bucketIndex + 1).join('/');
                  
                  // Only delete files that belong to this user (security check)
                  if (filePath.startsWith(user.id + '/')) {
                    const { error: deleteError } = await supabase.storage
                      .from('restored_photos')
                      .remove([filePath]);

                    if (deleteError) {
                      console.error(`Error deleting storage file ${filePath}:`, deleteError);
                      deletionResults.storageErrors.push(`${filePath}: ${deleteError.message}`);
                    } else {
                      deletionResults.storageFiles++;
                    }
                  }
                }
              } catch (urlError) {
                console.error("Error parsing storage URL:", urlError);
                deletionResults.storageErrors.push(`Invalid URL: ${restoration.restored_image_url}`);
              }
            }
          }
        } else {
          deletionResults.storageFiles = filePaths.length;
        }
      }
    }

    // Get all video generations to identify Vercel Blob videos to delete
    const { data: videoGenerations, error: fetchVideoError } = await supabase
      .from("video_generations")
      .select("video_url")
      .eq("user_id", user.id)
      .not("video_url", "is", null); // Only get records with video URLs

    if (fetchVideoError) {
      console.error("Error fetching video generations:", fetchVideoError);
      return NextResponse.json(
        { error: "Failed to fetch video generations" },
        { status: 500 }
      );
    }

    // Delete videos from Vercel Blob
    if (videoGenerations && videoGenerations.length > 0) {
      for (const video of videoGenerations) {
        if (video.video_url) {
          try {
            await deleteVideoFromBlob(video.video_url);
            deletionResults.blobVideos++;
          } catch (blobError) {
            console.error(`Error deleting video from Vercel Blob: ${video.video_url}`, blobError);
            deletionResults.blobErrors.push(`${video.video_url}: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`);
          }
        }
      }
    }

    // Delete all video generations for the user
    const { error: videoError, count: videoCount } = await supabase
      .from("video_generations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (videoError) {
      console.error("Error deleting video generations:", videoError);
      return NextResponse.json(
        { error: "Failed to delete video generations" },
        { status: 500 }
      );
    }

    deletionResults.videoGenerations = videoCount || 0;

    // Delete all image restorations for the user
    const { error: imageError, count: imageCount } = await supabase
      .from("image_restorations")
      .delete({ count: 'exact' })
      .eq("user_id", user.id);

    if (imageError) {
      console.error("Error deleting image restorations:", imageError);
      return NextResponse.json(
        { error: "Failed to delete image restorations" },
        { status: 500 }
      );
    }

    deletionResults.imageRestorations = imageCount || 0;

    // Return success response with detailed results
    return NextResponse.json(
      { 
        message: "All media deleted successfully",
        deletedTables: ["video_generations", "image_restorations"],
        deletionResults: {
          videoGenerations: deletionResults.videoGenerations,
          imageRestorations: deletionResults.imageRestorations,
          storageFiles: deletionResults.storageFiles,
          blobVideos: deletionResults.blobVideos,
          storageErrors: deletionResults.storageErrors.length > 0 ? deletionResults.storageErrors : undefined,
          blobErrors: deletionResults.blobErrors.length > 0 ? deletionResults.blobErrors : undefined
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