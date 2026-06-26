"use client"

import RemovePersonClient from "@/components/remove-person-client"

interface Props {
  user: { email: string; id: string }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function RemovePersonDashboardClient({ user, initialCredits, isPaymentSuccess }: Props) {
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
            <h1 className="font-inter mb-2 text-3xl font-bold text-black md:text-4xl">Remove Person or Object</h1>
            <p className="text-lg text-gray-600">
              Brush over a person or object, then let AI remove the marked area and rebuild the background naturally.
            </p>
          </div>

          <div className="rounded-xl border-6 border-gray-200 bg-white p-6">
            <RemovePersonClient userCredits={initialCredits} user={user} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-black">Tips for Best Results</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-gray-700">
                <li>Brush slightly beyond the object edges so the model sees the full removal area.</li>
                <li>Use a larger brush for bodies and a smaller brush near faces or detailed backgrounds.</li>
                <li>Keep unmarked people and objects untouched for stronger preservation.</li>
                <li>Use the optional instruction only when the marked area could be ambiguous.</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-black">How It Works</h3>
              <p className="mt-2 text-sm text-gray-700">
                The editor creates one guidance image: your original photo with a semi-transparent orange brush mark baked in. AI removes only that marked area and returns a private R2-hosted result.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}