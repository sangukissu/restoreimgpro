import Image from "next/image"
import {
  Check,
  Download,
  Maximize2,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Users,
} from "lucide-react"
import {
  FAMILY_PORTRAIT_HOW_TO,
  FAMILY_PORTRAIT_HOW_TO_STEPS,
} from "@/lib/family-portrait/how-to-steps"

const INPUT_REFS = [
  { img: "/separate-family-portrait-father.jpg", label: "Input 1: Father" },
  { img: "/separate-family-portrait-mother.jpg", label: "Input 2: Mother" },
  { img: "/separate-family-portrait-daughter.jpg", label: "Input 3: Daughter" },
  { img: "/separate-family-portrait-son.jpg", label: "Input 4: Son" },
] as const

const STEP_UI = [
  {
    icon: Upload,
    visual: (
      <div className="relative h-full w-full overflow-hidden bg-gray-50">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute inset-3 grid grid-cols-2 gap-2 sm:inset-4">
          {INPUT_REFS.map((input) => (
            <figure
              key={input.img}
              className="relative h-full min-h-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <Image
                src={input.img}
                alt={input.label}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1.5 pt-5">
                <span className="block truncate text-[8px] font-bold uppercase tracking-wider text-white sm:text-[9px]">
                  {input.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: SlidersHorizontal,
    visual: (
      <div className="relative flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-gray-50 p-4">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative grid grid-cols-3 gap-2">
          {[
            { name: "Studio", active: true },
            { name: "Meadow", active: false },
            { name: "Urban", active: false },
            { name: "Winter", active: false },
            { name: "Poolside", active: false },
            { name: "Rooftop", active: false },
          ].map((style) => (
            <div
              key={style.name}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2.5 shadow-sm transition-all duration-300 ${
                style.active
                  ? "border-brand-orange bg-white ring-2 ring-brand-orange/20"
                  : "border-gray-100 bg-white group-hover:border-gray-200"
              }`}
            >
              <div
                className={`h-7 w-7 rounded-lg ${
                  style.active
                    ? "bg-brand-orange/15 text-brand-orange"
                    : "bg-gray-100 text-gray-400"
                } flex items-center justify-center`}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span
                className={`text-[9px] font-bold ${
                  style.active ? "text-brand-black" : "text-gray-400"
                }`}
              >
                {style.name}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm">
          <Shirt className="h-3.5 w-3.5 text-brand-orange" />
          <span className="text-[10px] font-bold text-gray-600">Match outfit to style</span>
          <span className="ml-auto h-4 w-7 rounded-full bg-brand-orange/90 p-0.5">
            <span className="block h-3 w-3 translate-x-3 rounded-full bg-white shadow-sm" />
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    visual: (
      <div className="relative flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-gray-50 p-4">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-brand-orange" />
            <span className="text-[10px] font-bold text-gray-600">People</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[11px] font-bold text-gray-400">
              −
            </span>
            <span className="w-5 text-center text-sm font-extrabold text-brand-black">4</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-orange text-[11px] font-bold text-white">
              +
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
            <Maximize2 className="h-3 w-3" />
            Canvas
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: "1:1", w: "w-6", h: "h-6", active: false },
              { label: "3:4", w: "w-5", h: "h-7", active: false },
              { label: "4:3", w: "w-7", h: "h-5", active: true },
              { label: "16:9", w: "w-8", h: "h-4", active: false },
            ].map((ratio) => (
              <div
                key={ratio.label}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 shadow-sm transition-all ${
                  ratio.active
                    ? "border-brand-orange bg-white ring-2 ring-brand-orange/20"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div
                  className={`${ratio.w} ${ratio.h} rounded-sm ${
                    ratio.active ? "bg-brand-orange" : "bg-gray-200"
                  }`}
                />
                <span
                  className={`text-[9px] font-bold ${
                    ratio.active ? "text-brand-black" : "text-gray-400"
                  }`}
                >
                  {ratio.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Download,
    visual: (
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50 p-4">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Generating
            </span>
            <span className="text-[10px] font-extrabold text-brand-orange">72%</span>
          </div>
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[72%] rounded-full bg-brand-orange transition-all group-hover:w-[88%]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
            <span className="text-[10px] font-medium text-gray-500">Matching lighting & likeness…</span>
          </div>
        </div>
        <div className="relative flex w-full items-center gap-2 rounded-xl border border-green-100 bg-green-50/80 px-3 py-2.5 shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold text-brand-black">Ready to download</p>
            <p className="text-[9px] font-medium text-gray-500">Review faces, then save</p>
          </div>
          <Download className="h-4 w-4 shrink-0 text-green-600" />
        </div>
      </div>
    ),
  },
] as const

const STEPS = FAMILY_PORTRAIT_HOW_TO_STEPS.map((step, index) => ({
  ...step,
  ...STEP_UI[index],
}))

export function FamilyPortrait() {
  return (
    <section id="how-it-works" className="bg-brand-bg px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-col gap-7 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
              <span className="text-brand-orange">//</span> How It Works{" "}
              <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] font-[850] leading-[1.03] tracking-tighter text-brand-black sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem]">
              How BringBack AI creates
              <br />
              <span className="text-gray-400">believable AI family portraits.</span>
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
            {FAMILY_PORTRAIT_HOW_TO.description}
          </p>
        </div>

        <div className="rounded-[1.8rem] bg-brand-surface p-2 sm:rounded-[2.5rem] sm:p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <article
                  key={step.number}
                  className="group flex min-h-[420px] flex-col rounded-[1.5rem] bg-white p-6 sm:p-7"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2F2F0] text-brand-black transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="select-none text-5xl font-[800] leading-none text-gray-100 transition-colors group-hover:text-gray-200 sm:text-6xl">
                      {step.number}
                    </span>
                  </div>

                  <div className="relative z-10 mb-4">
                    <h3 className="mb-2 text-xl font-bold leading-tight text-brand-black sm:text-2xl">
                      {step.name}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-gray-600">
                      {step.text}
                    </p>
                  </div>

                  <div className="mt-auto h-[200px] overflow-hidden rounded-2xl border border-gray-100 shadow-inner transition-transform duration-300 group-hover:-translate-y-1 sm:h-[220px] sm:rounded-3xl">
                    {step.visual}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                    {step.note}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
