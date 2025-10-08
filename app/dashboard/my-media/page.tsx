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
    .select("id, video_url, preset_name, created_at")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  const resolvedSearchParams = await searchParams;
  const isPaymentSuccess = resolvedSearchParams.payment === "success";

  return (
    <MyMediaClient 
      user={{ email: data.user.email || "", id: data.user.id }} 
      initialCredits={credits}
      isPaymentSuccess={isPaymentSuccess}
      videos={videos || []}
    />
  );
}