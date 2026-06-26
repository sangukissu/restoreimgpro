"use client"

import AddPersonClient from "@/components/add-person-client"

interface Props {
  user: { email: string; id: string }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function AddPersonDashboardClient({ user, initialCredits, isPaymentSuccess }: Props) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-inter mb-2 text-3xl font-bold text-black md:text-4xl">Add Person to Photo</h1>
            <p className="text-lg text-gray-600">
              Insert someone into an existing photo while preserving the original scene, lighting, and composition.
            </p>
          </div>

          <div className="rounded-xl border-6 border-gray-200 bg-white p-6">
            <AddPersonClient userCredits={initialCredits} user={user} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-black">Tips for Best Results</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-gray-700">
                <li>Use a base photo with enough empty space near your chosen placement.</li>
                <li>Pick a clear person photo with the full face and body visible when possible.</li>
                <li>Match camera angle and lighting direction for more natural composition.</li>
                <li>Restore damaged or blurry images first for stronger identity preservation.</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-black">What You Get</h3>
              <p className="mt-2 text-sm text-gray-700">
                A single photorealistic image stored privately in your account and ready to download or add to a keepsake.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}