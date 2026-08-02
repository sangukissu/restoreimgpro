import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FamilyPortraitFinalCTA() {
  return (
    <section id="create-family-portrait" className="bg-brand-bg px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1320px] rounded-[2rem] bg-brand-orange p-2 sm:rounded-[3rem] sm:p-3">
        <div className="grid overflow-hidden rounded-[1.55rem] bg-white lg:grid-cols-[0.92fr_1.08fr] sm:rounded-[2.35rem]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-16">
            <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.16em] text-brand-orange">
              Family Photo AI
            </p>
            <h2 className="max-w-xl text-[2.5rem] font-[850] leading-[0.98] tracking-tighter text-brand-black sm:text-[3.5rem] lg:text-[4rem]">
              Ready to Bring Everyone Into One Portrait?
            </h2>
            <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-gray-600">
              Upload separate photos and create one shared set of{" "}
              <strong className="font-extrabold text-brand-black">AI family photos</strong>{" "}
              you can download and print.
            </p>
            <Link
              href="/dashboard/family-portrait"
              className="mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-brand-black px-7 py-4 text-base font-bold text-white transition-colors hover:bg-brand-orange"
            >
              Create Your Family Portrait
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="relative min-h-[320px] bg-gray-100 sm:min-h-[420px] lg:min-h-[560px]">
            <Image
              src="/family-portrait.png"
              alt="Family brought together in one shared AI portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
