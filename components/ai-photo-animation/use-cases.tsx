"use client";

import { Scroll, Heart, Gift } from "lucide-react";

export function AIAnimationUseCases() {
  const cases = [
    {
      icon: <Scroll className="w-8 h-8 text-brand-orange" />,
      title: "Genealogy & Ancestry",
      description: "Bring your family tree to life. See your great-grandparents move and smile just as they did in real life. Perfect for ancestry researchers and family historians."
    },
    {
      icon: <Heart className="w-8 h-8 text-brand-orange" />,
      title: "Memorial Tributes",
      description: "Create a touching addition to a memorial service or digital frame. A moving portrait of a deceased loved one offers a powerful way to remember their presence."
    },
    {
      icon: <Gift className="w-8 h-8 text-brand-orange" />,
      title: "Unique Family Gifts",
      description: "Surprise your parents or grandparents by animating their childhood photos. A nostalgic gift that reconnects generations through living memories."
    }
  ];

  return (
    <section className="py-24 bg-brand-surface">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-black leading-[1.1] mb-4">
            Ways to Use <br className="sm:hidden" /> AI Photo Animation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-brand-surface border border-gray-100 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
