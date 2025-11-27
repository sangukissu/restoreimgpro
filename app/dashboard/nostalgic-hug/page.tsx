import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import NostalgicHugClient from "@/components/nostalgic-hug-client"

export default async function NostalgicHugPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const resolvedSearchParams = await searchParams
    const isPaymentSuccess = resolvedSearchParams.payment === "success"

    return (
        <NostalgicHugClient
            user={{
                email: user.email || "",
                id: user.id,
            }}
            initialCredits={profile?.credits || 0}
            isPaymentSuccess={isPaymentSuccess}
        />
    )
}
