"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileImage,
  Frame,
  Lock,
  ScanFace,
  Sparkles,
  Users,
} from "lucide-react";

const PROMISES = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "Separate photos into one family photo",
    text: "Upload individual portraits taken in different places, years, or cameras. BringBack composes them into one believable group portrait.",
  },
  {
    icon: <ScanFace className="h-5 w-5" />,
    title: "Likeness-first generation",
    text: "The prompt is built around preserving each person's face, age, expression, and recognizable details instead of creating a generic family.",
  },
  {
    icon: <Frame className="h-5 w-5" />,
    title: "Studio-style output",
    text: "Choose canvas ratios and refined backdrops so the final image feels ready for a frame, memorial table, holiday card, or family archive.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Private family memories",
    text: "Uploads are processed securely, saved to your account media, and handled with the privacy expectations sensitive family photos deserve.",
  },
];

const PHOTO_TIPS = [
  "Use JPG, PNG, or WebP images under 20MB each.",
  "Upload 2 to 4 clear face photos for one combined family portrait.",
  "Crop each person so the face is visible and not covered by sunglasses, hair, or heavy shadows.",
  "For old, torn, faded, or blurry images, restore the photo first before using it in the family portrait generator.",
];

const CANVAS_OPTIONS = [
  {
    ratio: "1:1",
    use: "Profile photo, framed square print, two-person portrait",
  },
  {
    ratio: "3:4",
    use: "Vertical memorial portrait, parent and child, grandparent keepsake",
  },
  {
    ratio: "4:3",
    use: "Classic family group photo with 3 to 4 people",
  },
  {
    ratio: "16:9",
    use: "Wide family wall print, holiday card, multi-generation layout",
  },
];

const BACKDROPS = [
  "Matte black",
  "Neutral gray",
  "Warm beige",
  "Subtle gradient",
  "Dark brown vignette",
  "Gentle bokeh",
];

export default function FamilyPortraitConversionGuide() {
  return (
    <section id="create-family-photo-from-individual-photos" className="w-full px-4 sm:px-8 py-24 bg-white">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
              <span className="text-brand-orange">//</span> Built for Real Families <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.7rem] font-extrabold leading-[1] tracking-tight text-brand-black sm:text-[4rem]">
              Create a family photo from individual photos.
            </h2>
          </div>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-gray-600">
            Most merge-photo tools stop at a collage. BringBack creates a new studio-quality family portrait, matching scale, light, color, and composition so the people look photographed together.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          {PROMISES.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-gray-100 bg-[#F7F6F2] p-7">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-orange shadow-sm">
                {item.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold leading-tight text-brand-black">{item.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-gray-600">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.5rem] bg-brand-black p-8 text-white">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-brand-orange">
                <FileImage className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold">Best photos to upload</h3>
            </div>
            <ul className="space-y-4">
              {PHOTO_TIPS.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm font-medium leading-relaxed text-gray-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/old-photo-restoration"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-black transition hover:bg-gray-100"
            >
              Restore old photos first
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[1.5rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-brand-black">Canvas and studio choices</h3>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-gray-600">
                  Choose the format based on the number of people and the final use. Wider layouts usually look more natural for 3 to 4 people.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
                <Sparkles className="h-3.5 w-3.5" />
                2 credits
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {CANVAS_OPTIONS.map((option) => (
                <div key={option.ratio} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="mb-2 text-2xl font-extrabold text-brand-black">{option.ratio}</div>
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{option.use}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {BACKDROPS.map((backdrop) => (
                <span key={backdrop} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                  {backdrop}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
