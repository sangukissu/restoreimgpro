"use client"

import { Cover } from "@/components/ui/cover"

export default function MemoriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
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
                Watch grandparents smile, see children laugh, and bring family gatherings back to life with gentle,
                natural animation.
              </p>
            </div>
          </div>

          {/* Wedding Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">💒</div>
              <h3 className="text-xl font-semibold text-black mb-2">Wedding Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                Restore the magic of your special day. See the bride's smile, the groom's joy, and relive those precious
                vows.
              </p>
            </div>
          </div>

          {/* Historical Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🏛️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Historical Moments</h3>
              <p className="text-gray-600 leading-relaxed">
                Bring history to life. From vintage portraits to historical events, watch the past move again with
                respectful animation.
              </p>
            </div>
          </div>

          {/* Childhood Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🧸</div>
              <h3 className="text-xl font-semibold text-black mb-2">Childhood Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                See your younger self come alive. Watch childhood innocence, playful moments, and growing up memories
                move again.
              </p>
            </div>
          </div>

          {/* Pet Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🐕</div>
              <h3 className="text-xl font-semibold text-black mb-2">Beloved Pets</h3>
              <p className="text-gray-600 leading-relaxed">
                Honor your furry friends. Watch their tails wag, see their playful expressions, and remember the joy
                they brought.
              </p>
            </div>
          </div>

          {/* Military Photos */}
          <div className="group">
            <div className="border-l-4 border-gray-400 pl-6 hover:border-black transition-colors duration-300">
              <div className="text-2xl mb-3">🎖️</div>
              <h3 className="text-xl font-semibold text-black mb-2">Military Heritage</h3>
              <p className="text-gray-600 leading-relaxed">
                Honor service members. Restore uniforms, medals, and bring dignity to those who served with respectful
                animation.
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  )
}
