import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyMediaClient from "@/components/my-media-client";

export default async function MyMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Fetch user credits from user_profiles
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", data.user.id)
    .single();

  const credits = profile?.credits || 0;

  // Fetch user's generated videos
  const { data: videos } = await supabase
    .from("video_generations")
    .select("id, video_url, preset_name, created_at, status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  // Fetch Nostalgic Hug videos
  const { data: nostalgicVideos } = await supabase
    .from("nostalgic_hug_generations")
    .select("id, video_url, created_at, status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  // Fetch Image Restorations
  const { data: restoredImages } = await supabase
    .from("image_restorations")
    .select("id, restored_image_url, created_at, status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  // Fetch Family Portraits
  const { data: familyPortraits } = await supabase
    .from("family_portraits")
    .select("id, composed_image_url, created_at, status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  // Combine and sort videos
  const allVideos = [
    ...(videos || []).map((v: any) => ({ ...v, type: 'animation' })),
    ...(nostalgicVideos || []).map((v: any) => ({ ...v, preset_name: 'Nostalgic Hug', type: 'nostalgic-hug' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Combine and sort images
  const allImages = [
    ...(restoredImages || []).map((img: any) => ({
      id: img.id,
      url: img.restored_image_url,
      created_at: img.created_at,
      status: img.status || 'completed',
      type: 'restoration',
      title: 'Restored Photo'
    })),
    ...(familyPortraits || []).map((img: any) => ({
      id: img.id,
      url: img.composed_image_url,
      created_at: img.created_at,
      status: img.status || 'completed',
      type: 'family-portrait',
      title: 'Family Portrait'
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const resolvedSearchParams = await searchParams;
  const isPaymentSuccess = resolvedSearchParams.payment === "success";

  return (
    <MyMediaClient
      user={{ email: data.user.email || "", id: data.user.id }}
      initialCredits={credits}
      isPaymentSuccess={isPaymentSuccess}
      videos={allVideos}
      images={allImages}
    />
  );
}