"use client";

import { Scroll, Heart, Gift, Clapperboard, BookOpen } from "lucide-react";

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
    },
    {
      icon: <Clapperboard className="w-8 h-8 text-brand-orange" />,
      title: "Social Media Storytelling",
      description: "Turn still portraits into short clips for reels, stories, and tribute posts. Animated memories drive higher engagement and stronger emotional response."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-brand-orange" />,
      title: "Documentaries & Oral Histories",
      description: "Use subtle animations in family documentaries, school history projects, and archive presentations to make historical narratives feel more human."
    }
  ];

  const testimonials = [
    {
      quote: "I animated my late grandfather's portrait and used it in our family reunion slideshow. Everyone went silent, then started smiling.",
      author: "Nina J.",
      context: "Family Reunion Project"
    },
    {
      quote: "The Smile + Wave style made our anniversary tribute video feel alive without looking fake. It was exactly the tone we wanted.",
      author: "Marco T.",
      context: "Memorial Tribute"
    },
    {
      quote: "We used animated ancestor photos in our genealogy presentation and it instantly held the room's attention.",
      author: "Alina R.",
      context: "Genealogy Workshop"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

        <div className="mt-16">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-black mb-8 text-center">
            What Families Say About Animation Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  "{item.quote}"
                </p>
                <div className="text-sm text-gray-500">
                  <span className="font-bold text-brand-black">{item.author}</span>
                  <span className="mx-2">•</span>
                  <span>{item.context}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
