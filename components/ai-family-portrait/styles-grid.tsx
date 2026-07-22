import Image from "next/image"
import {
  ArrowRight,
  Camera,
  Check,
  Download,
  LayoutTemplate,
  Palette,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  Upload,
} from "lucide-react"

const STEPS = [
  {
    number: "01",
    title: "Upload individual portraits",
    description:
      "Add 2 to 4 clear photos from phones, scans, or family albums. Front-facing faces with visible features give the strongest likeness.",
    note: "JPG, PNG or WebP · up to 4 people",
    icon: Upload,
  },
  {
    number: "02",
    title: "Choose canvas and setting",
    description:
      "Pick a 1:1, 3:4, 4:3, or 16:9 canvas, then choose matte black, neutral gray, warm beige, gradient, dark brown, or bokeh.",
    note: "You control format and atmosphere",
    icon: SlidersHorizontal,
  },
  {
    number: "03",
    title: "AI composes one natural scene",
    description:
      "BringBack generates a new scene, using the references to balance face scale, perspective, lighting, color, and placement.",
    note: "A generated portrait, not a pasted collage",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Review and download",
    description:
      "Compare the result with every source face, regenerate if needed, and check the downloaded dimensions before ordering a large print.",
    note: "Review likeness before sharing or printing",
    icon: Download,
  },
]

const INPUTS = [
  { src: "/family-photo1.png", label: "Son" },
  { src: "/family-photo2.jpg", label: "Grandfather" },
  { src: "/family-photo3.png", label: "Father" },
  { src: "/family-photo4.png", label: "Mother" },
]

const HARMONIZATION = [
  { icon: SunMedium, title: "Lighting", description: "Balanced exposure and direction" },
  { icon: Palette, title: "Color", description: "Unified tone and skin color" },
  { icon: LayoutTemplate, title: "Composition", description: "Natural scale and placement" },
  { icon: Camera, title: "Review", description: "Check faces and fine details" },
]

export function FamilyPortrait() {
  return (
    <section id="how-it-works" className="bg-brand-bg px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-col gap-7 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
              <span className="text-brand-orange">//</span> How It Works <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] font-[850] leading-[1.03] tracking-tighter text-brand-black sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem]">
              Four references become
              <br />
              <span className="text-gray-400">one believable family portrait.</span>
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
            From choosing clear references to reviewing the result, the workflow helps you create one portrait while keeping realistic expectations about AI-generated details.
          </p>
        </div>

        <div className="rounded-[2rem] bg-brand-surface p-2 sm:rounded-[3rem] sm:p-3 lg:p-4">
          <div className="grid gap-3 xl:grid-cols-[0.82fr_1.18fr]">
            <ol className="grid list-none gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
              {STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <li
                    key={step.number}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/25 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-black text-white transition-colors group-hover:bg-brand-orange">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-orange">
                            Step {step.number}
                          </span>
                          <span className="text-2xl font-black tracking-tighter text-gray-100">{step.number}</span>
                        </div>
                        <h3 className="mb-2 text-lg font-extrabold leading-tight text-brand-black sm:text-xl">
                          {step.title}
                        </h3>
                        <p className="text-sm font-medium leading-relaxed text-gray-600">{step.description}</p>
                        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          <Check className="h-3.5 w-3.5 text-brand-orange" />
                          {step.note}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>

            <div className="flex min-w-0 flex-col rounded-[1.6rem] border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-orange">Visual workflow</span>
                  <h3 className="mt-1 text-xl font-[850] tracking-tight text-brand-black sm:text-2xl">
                    Separate references, one generated scene
                  </h3>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Review likeness
                </span>
              </div>

              <div className="grid flex-1 gap-3 lg:grid-cols-[0.72fr_auto_1.28fr] lg:items-center">
                <div>
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <span>Input references</span>
                    <span>4 photos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {INPUTS.map((input) => (
                      <figure key={input.src} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 sm:rounded-2xl">
                        <Image
                          src={input.src}
                          alt={`${input.label} input portrait`}
                          fill
                          sizes="(max-width: 1024px) 40vw, 12vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <figcaption className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-2 py-1 text-[9px] font-bold text-white backdrop-blur sm:bottom-2 sm:left-2">
                          {input.label}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/20 lg:flex">
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <span>Final composite</span>
                    <span className="text-brand-orange">AI harmonized</span>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-inner sm:rounded-[1.6rem]">
                    <Image
                      src="/family-portrait.png"
                      alt="Unified family portrait result"
                      fill
                      sizes="(max-width: 1024px) 90vw, 38vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-black/70 px-3 py-2.5 text-center text-[10px] font-bold text-white backdrop-blur sm:inset-x-4 sm:bottom-4 sm:text-xs">
                      Shared lighting · balanced scale · unified backdrop
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-5 sm:grid-cols-4">
                {HARMONIZATION.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-2xl bg-brand-surface p-3 sm:p-4">
                      <Icon className="mb-3 h-4 w-4 text-brand-orange" />
                      <h4 className="text-xs font-extrabold text-brand-black">{item.title}</h4>
                      <p className="mt-1 text-[10px] font-medium leading-relaxed text-gray-500">{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
