import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MyMediaPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: videos, error: videosError } = await supabase
    .from("video_generations")
    .select("id, video_url, preset_name, created_at")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Media</h1>
      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {videos.map((video: any) => (
            <div key={video.id} className="border rounded-lg overflow-hidden">
              {video.video_url ? (
                <video
                  src={video.video_url}
                  className="w-full h-auto"
                  controls
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Video processing...</p>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{video.preset_name}</h3>
                <p className="text-gray-400 text-xs mt-4">
                  {new Date(video.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't generated any videos yet.</p>
      )}
    </div>
  );
}