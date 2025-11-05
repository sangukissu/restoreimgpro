"use client"

import { Cover } from "@/components/ui/cover"

export default function DenoiseTestimonialsSection() {
  const testimonials = [
    {
      quote:
        "My low-light photos from the city at night were so grainy they looked unusable. BringBack cleaned them up perfectly while keeping all the important details sharp. Now they look professional!",
      author: "David Kim",
      role: "Street Photographer",
    },
    {
      quote:
        "Indoor party photos from my phone always looked terrible with all the noise. This AI made them look like they were taken with a professional camera! The difference is incredible.",
      author: "Lisa Martinez",
      role: "Event Planner",
    },
    {
      quote:
        "I shoot a lot of concerts in low light, and the grain was always a problem. BringBack removes all the noise while keeping the atmosphere and mood of the photos intact.",
      author: "Jake Thompson",
      role: "Music Photographer",
    },
    {
      quote:
        "My old digital camera from 2010 produced such grainy photos. I thought they were unusable, but this tool made them look modern and clean. It's like having a time machine for photos!",
      author: "Maria Santos",
      role: "Family Photographer",
    },
  ]

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className=" text-4xl lg:text-5xl font-bold text-black mb-4">
            Moments worth <Cover>cleaning</Cover>
          </h2>
          <p className="text-lg text-gray-600">Real people, real photos made noise-free</p>
        </div>

        {/* Testimonials */}
        <div className="space-y-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border-l-2 border-gray-100 pl-8">
              <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{testimonial.author}</span>
                <span className="mx-2">·</span>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="text-center mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-600">Join thousands who've already cleaned up their most precious moments</p>
        </div>
      </div>
    </section>
  )
}
