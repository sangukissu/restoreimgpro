import {
  FamilyHeritageViewer,
  type MemoryBookAssetSource,
} from "@/components/memory-book/family-heritage-viewer"
import type { MemoryBookDocumentV1 } from "@/lib/memory-book/types"

const assets = [
  ["11111111-1111-4111-8111-111111111111", "/family-photo2.jpg", "Family gathering"],
  ["22222222-2222-4222-8222-222222222222", "/grandma.png", "Grandmother portrait"],
  ["33333333-3333-4333-8333-333333333333", "/family-photo3.png", "Family afternoon"],
  ["44444444-4444-4444-8444-444444444444", "/old-image1.webp", "Old family portrait"],
  ["55555555-5555-4555-8555-555555555555", "/family-photo4.png", "A day together"],
  ["66666666-6666-4666-8666-666666666666", "/old-image3.webp", "A restored memory"],
] as const

const assetSources: MemoryBookAssetSource[] = assets.map(([id, src]) => ({
  id,
  mediaType: "image",
  src,
  downloadUrl: src,
}))

const document: MemoryBookDocumentV1 = {
  schemaVersion: 1,
  theme: "family_heritage_v1",
  bookId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  cover: {
    title: "Our Family Heritage",
    subtitle: "For Dad",
    periodLabel: "Stories across generations",
  },
  dedication: "For the person who made ordinary days feel worth remembering.",
  spreads: [0, 1, 2].map((index) => ({
    id: `preview-spread-${index + 1}`,
    left: {
      kind: "botanical",
      flower: "daisy",
    },
    right: {
      kind: "memories",
      heading: ["Where our story begins", "The faces we carry", "Still with us"][index],
      body:
        index === 0
          ? "To the man who gave up his todays so we could build our tomorrows. This book holds the places you built, the laughter you protected, and the small rituals that became our family history. Every photograph is another way of saying that none of it was ordinary to us."
          : "A few photographs can hold an entire generation: its tenderness, its courage, the jokes told around the table, and the ordinary afternoons that became precious once time moved on.",
      assets: assets.slice(index * 2, index * 2 + 2).map(([id, , alt], assetIndex) => ({
        id,
        mediaType: "image",
        caption: assetIndex === 0 ? "A moment kept close." : "The light we still remember.",
        alt,
        featured: assetIndex === 0,
      })),
    },
  })),
  music: {
    enabled: false,
    trackId: "family-heritage-moonlight",
    title: "Moonlight",
    src: "/music/scott-buckley-moonlight(chosic.com).mp3",
    attribution: "'Moonlight' by Scott Buckley, released under CC BY 4.0.",
  },
  presentation: {
    downloadsEnabled: true,
    desktopMode: "flipbook",
    mobileMode: "swipe",
  },
}

export default function MemoryBookPreviewPage() {
  return <FamilyHeritageViewer document={document} assetSources={assetSources} />
}
