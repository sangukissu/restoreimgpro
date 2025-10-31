"use client"

import { Cover } from "@/components/ui/cover"

export default function MemoriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-black mb-6">
            Every <Cover>memory</Cover> deserves to live forever
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From faded family portraits to damaged historical photos, our AI brings every precious moment back to life
            with stunning clarity and gentle animation.
          </p>
        </div>

        {/* Memory Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Family Portraits */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-semibold text-black mb-2">Family Portraits</h3>
              <p className="text-gray-600 leading-relaxed">
                That familiar twinkle in your grandmother’s eye, the infectious giggle of your children, the warmth of a
                family hug—see it all again, not just as a static image, but as a living moment.
              </p>
            </div>
          </div>

          {/* Wedding Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">💒</div>
              <h3 className="text-xl font-semibold text-black mb-2">Wedding Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                The day you said 'I do' was filled with a million tiny, perfect moments. We bring back the nervous
                smile, the joyful tear, and the loving glance that made your wedding day uniquely yours.
              </p>
            </div>
          </div>

          {/* Historical Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🏛️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Historical Moments</h3>
              <p className="text-gray-600 leading-relaxed">
                History isn't just dates and facts; it's the stories of those who came before us. Watch ancestors and
                historical figures come to life, connecting you to your past in a way you never thought possible.
              </p>
            </div>
          </div>

          {/* Childhood Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🧸</div>
              <h3 className="text-xl font-semibold text-black mb-2">Childhood Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                That mischievous grin, the scraped knees from a summer of adventure, the pure joy of being a kid.
                Reconnect with your inner child and see your own story unfold.
              </p>
            </div>
          </div>

          {/* Pet Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🐕</div>
              <h3 className="text-xl font-semibold text-black mb-2">Beloved Pets</h3>
              <p className="text-gray-600 leading-relaxed">
                They're not just pets; they're family. We bring back the happy tail wags, the gentle purrs, and the
                unconditional love that made them so special. See your best friend again.
              </p>
            </div>
          </div>

          {/* Military Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🎖️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Military Heritage</h3>
              <p className="text-gray-600 leading-relaxed">
                A uniform tells a story of courage, sacrifice, and honor. We restore these powerful portraits with the
                dignity and respect they deserve, creating a moving tribute to the heroes in your family.
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  )
}
