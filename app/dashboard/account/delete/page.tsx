import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DeleteAccountClient } from "@/components/account/delete-account-client"

export const metadata = {
  title: "Delete account | BringBack",
  description: "Permanently delete your BringBack account and all associated data.",
}

export default async function DeleteAccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !user.email) {
    redirect("/login")
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6a44]">
        Danger zone
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-[#1f2421] md:text-4xl">
        Delete your account
      </h1>
      <p className="mt-3 text-base text-[#1f2421]/65">
        This is permanent. Once you confirm, your account and every piece of
        data tied to it is removed. There is no recovery, no email support
        restore, and no undo button.
      </p>

      <DeleteAccountClient userEmail={user.email} />
    </div>
  )
}
