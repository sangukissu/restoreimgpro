import Image from "next/image"

const STYLE_PREVIEWS = [
  {
    name: "Studio Matte Black Portrait",
    image: "/family-portrait.png",
    alt: "Multi-generation family portrait composed from separate reference photos against a matte black studio backdrop",
  },
  {
    name: "Studio Dark Brown Vignette Portrait",
    image: "/three-generation-reunion-combined.png",
    alt: "Grandparents, parents, and children brought together in a warm dark-brown vignette family portrait",
  },
  {
    name: "Wildflower Meadow",
    image: "/family-portrait-styles/wildflower-meadow.webp",
    alt: "Five family members standing together in a sunlit wildflower meadow portrait",
  },
  {
    name: "Poolside Summer",
    image: "/family-portrait-styles/poolside-summer.webp",
    alt: "Family gathered beside a turquoise swimming pool for a bright summer portrait",
  },
  {
    name: "Winter Snow Day",
    image: "/family-portrait-styles/winter-snow-day.webp",
    alt: "Family in coordinated winter clothing posing beside a snowman in a snowy park",
  },
  {
    name: "Urban Street",
    image: "/family-portrait-styles/urban-street.webp",
    alt: "Multi-generation family in smart-casual clothing posing on a quiet brick-lined city street",
  },
  {
    name: "Boho Meadow",
    image: "/family-portrait-styles/boho-meadow.webp",
    alt: "Multi-generation family wearing coordinated earth tones in a quiet bohemian meadow portrait",
  },
  {
    name: "Scenic Road Trip",
    image: "/family-portrait-styles/scenic-road-trip.webp",
    alt: "Family road-trip portrait beside a parked classic convertible at a desert mountain overlook",
  },
  {
    name: "Rooftop Evening",
    image: "/family-portrait-styles/rooftop-evening.webp",
    alt: "Five family members together on a rooftop under warm string lights at twilight",
  },
]

export function FamilyPortraitStyleShowcase() {
  return (
    <div id="portrait-styles" className="family-portrait-marquee mt-12" aria-label="Family portrait style examples">
      <div className="family-portrait-marquee-track">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="family-portrait-marquee-group"
            aria-hidden={copyIndex === 1}
          >
            {STYLE_PREVIEWS.map((style) => (
              <figure
                key={`${copyIndex}-${style.name}`}
                className="family-portrait-marquee-card relative aspect-[4/3] w-[240px] shrink-0 overflow-hidden rounded-[1.25rem] bg-gray-100 sm:w-[280px] lg:w-[300px]"
              >
                <Image
                  src={style.image}
                  alt={copyIndex === 0 ? style.alt : ""}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 300px"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-3 pb-3 pt-10"
                  aria-hidden={copyIndex === 1}
                >
                  <figcaption className="text-sm font-semibold tracking-wide text-white drop-shadow-sm sm:text-[0.9375rem]">
                    {style.name}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
