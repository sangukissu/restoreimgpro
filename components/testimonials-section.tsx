"use client"

import { Cover } from "@/components/ui/cover"

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I found my grandfather's war photos in a shoebox. Most were water-damaged and fading. After using BringBack, I could finally see his face clearly in his uniform. It felt like meeting him for the first time.",
      author: "Emma Chen",
      role: "Graphic Designer",
    },
    {
      quote:
        "Our wedding album got damaged in a basement flood. Twenty years of memories looked ruined. BringBack restored every single photo perfectly. My wife cried when she saw our first dance photo brought back to life.",
      author: "Marcus Rodriguez",
      role: "Teacher",
    },
    {
      quote:
        "My daughter's baby photos were stored on an old phone that crashed. The backup files were corrupted and pixelated. BringBack made them look like they were taken with a professional camera.",
      author: "Sarah Kim",
      role: "Marketing Manager",
    },
    {
      quote:
        "Found a torn photo of my grandmother's family from the 1940s. Half of it was missing, colors completely faded. The restoration was so good, I had it printed and framed for my mother's 80th birthday.",
      author: "David Thompson",
      role: "Architect",
    },
  ]

  return (
    <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100 mx-auto">

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
            Stories worth <Cover>preserving</Cover>
          </h2>
          <p className="text-lg text-gray-600">Real people, real memories restored</p>
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
          <p className="text-gray-600">Join thousands of families preserving their most precious memories</p>
        </div>
      </div>
    </section>
  )
}
