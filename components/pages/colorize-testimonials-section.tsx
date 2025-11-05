"use client"

import { Cover } from "@/components/ui/cover"

export default function ColorizeTestimonialsSection() {
  const testimonials = [
    {
      quote:
        "My great-grandmother's wedding photo from 1925 was beautiful but colorless. BringBack made it look like it was taken yesterday - the dress, flowers, and skin tones are so realistic! My family was amazed.",
      author: "Emma Thompson",
      role: "Family Historian",
    },
    {
      quote:
        "I colorized my entire family's vintage photo collection for a reunion slideshow. The AI understood different eras perfectly - 1940s military uniforms, 1960s fashion, everything looked authentic.",
      author: "Robert Chen",
      role: "Genealogy Enthusiast",
    },
    {
      quote:
        "As a museum curator, I was skeptical about AI colorization. But BringBack's results are historically accurate and respectful. We've used it for several exhibition pieces with amazing results.",
      author: "Dr. Sarah Martinez",
      role: "Museum Curator",
    },
    {
      quote:
        "My grandfather's childhood photos from the 1930s came alive with color. Seeing him as a young boy in vibrant color made him feel so much more real and present. It's like meeting him for the first time.",
      author: "Michael Johnson",
      role: "Family Archivist",
    },
  ]

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className=" text-4xl lg:text-5xl font-bold text-black mb-4">
            Memories worth <Cover>colorizing</Cover>
          </h2>
          <p className="text-lg text-gray-600">Real people, real vintage photos brought to colorful life</p>
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
          <p className="text-gray-600">Join thousands who've already brought color to their family history</p>
        </div>
      </div>
    </section>
  )
}
