"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function DenoiseHero() {
  return (
    <section className="relative mx-auto w-full max-w-[1320px] overflow-hidden px-4 pb-24 pt-32 sm:px-8 lg:pt-40">
      <div className="absolute inset-0 -z-10 opacity-[0.03] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute left-1/2 top-10 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[#FF4D00]/5 blur-[120px]" />

      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
            <span className="text-brand-orange">//</span> AI Denoise &amp; Sharpen
          </div>
          <h1 className="mb-7 text-5xl font-[850] leading-[0.96] tracking-tighter text-brand-black sm:text-6xl xl:text-7xl">
            Unblur &amp; Sharpen <span className="text-gray-400">Old Photos</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
            Remove film grain, reduce digital noise, and recover clearer facial details from soft or blurry family photos with AI.
          </p>
          <div className="mb-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-gray-600">
            {['Natural detail recovery', 'Compare before download', 'Private processing'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-orange" /> {item}
              </span>
            ))}
          </div>
          <Link
            href="/dashboard/restore"
            className="group inline-flex items-center gap-5 rounded-full bg-brand-orange py-2 pl-7 pr-2 font-bold text-white shadow-xl shadow-brand-orange/20 transition hover:scale-105"
          >
            Sharpen Your Photo
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-black transition-transform group-hover:rotate-45">
              <ArrowRight className="h-5 w-5 text-brand-orange" />
            </span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[1.8rem] bg-brand-surface p-2 shadow-2xl shadow-black/10">
          <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden rounded-[1.35rem]">
            <div className="relative">
              <Image src="/blurred-lady.webp" alt="Blurry old portrait before AI sharpening" fill priority className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 25vw" />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">Before</span>
            </div>
            <div className="relative">
              <Image src="/unblurred-lady.webp" alt="Clear old portrait after AI sharpening" fill priority className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 25vw" />
              <span className="absolute bottom-4 right-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">After</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
