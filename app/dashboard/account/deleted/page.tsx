import Link from "next/link"

export const metadata = {
  title: "Account deleted | BringBack",
}

export default function AccountDeletedPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-5 text-center md:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6a44]">
        Goodbye
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-[#1f2421] md:text-4xl">
        Your account is gone.
      </h1>
      <p className="mt-4 max-w-md text-base text-[#1f2421]/65">
        Every memory, every credit, every receipt tied to your profile has
        been removed. The only thing we kept is a single, anonymized record
        that the deletion happened — for legal reasons, not for marketing.
      </p>
      <p className="mt-6 text-sm text-[#1f2421]/55">
        If you ever want to come back, you are welcome to start fresh.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-[#1f2421] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#2d352f]"
      >
        Return to home
      </Link>
    </div>
  )
}
