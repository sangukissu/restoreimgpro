"use client"

import { Cover } from "@/components/ui/cover"

export default function DeblurTestimonialsSection() {
  const testimonials = [
    {
      quote:
        "My concert photos were all blurry from the excitement and low light. BringBack made them sharp enough to print and frame. I can finally see every detail of my favorite band's performance.",
      author: "Alex Rodriguez",
      role: "Music Photographer",
    },
    {
      quote:
        "I thought my wedding photos were ruined by camera shake. This AI brought them back to life - they look professional now! My wife was so happy when she saw our first dance photo crystal clear.",
      author: "Michael Chen",
      role: "Groom",
    },
    {
      quote:
        "Sports photography is tough, and I had so many blurry action shots. BringBack saved dozens of photos that I thought were unusable. The motion blur is completely gone.",
      author: "Sarah Johnson",
      role: "Sports Photographer",
    },
    {
      quote:
        "My kids never sit still for photos, so everything was always blurry. Now I can actually see their faces clearly in every shot. It's like having a second chance at capturing the perfect moment.",
      author: "Jennifer Martinez",
      role: "Mom of Three",
    },
  ]

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
            Moments worth <Cover>sharpening</Cover>
          </h2>
          <p className="text-lg text-gray-600">Real people, real photos brought into focus</p>
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
          <p className="text-gray-600">Join thousands who've already sharpened their most precious moments</p>
        </div>
      </div>
    </section>
  )
}
