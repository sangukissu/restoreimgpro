
import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    rating: '5.0',
    quote: '"omg i cant believe u guys fixed my grandmas photo... i was crying when i saw it. thank you so much!!"',
    author: {
      name: 'Sarah Jenkins',
      role: 'Restored Family Portrait',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    rating: '4.9',
    quote: '"honestly i didnt expect much cause the photo was super damaged but wow. just wow. worth every penny."',
    author: {
      name: 'Mike T.',
      role: 'Restored Wedding Photo',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    rating: '5.0',
    quote: '"my dad passed away last year and this was the only photo i had of him smiling. thank you for bringing it back."',
    author: {
      name: 'Alex M.',
      role: 'Restored Father\'s Photo',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    rating: '4.8',
    quote: '"took a bit longer than i thought but result is amazing. my mom loved it."',
    author: {
      name: 'Emily R.',
      role: 'Restored Childhood Photo',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    rating: '5.0',
    quote: '"best service ever. i tried other apps but they just blurred the face. this one actually looks like my grandpa."',
    author: {
      name: 'David Chen',
      role: 'Restored Vintage Photo',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    }
  },
  {
    rating: '5.0',
    quote: '"simple to use and fast. quality is top notch. highly recommend for anyone with old photos."',
    author: {
      name: 'Jessica K.',
      role: 'Restored Holiday Photo',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
    }
  }
];

export const Clients: React.FC = () => {
  return (
    <section id="clients" className="w-full px-4 sm:px-8 py-24 bg-brand-bg pb-32">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Clients <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Why Families choose <br />
              <span className="text-gray-400/80">BringBack AI.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              See what families are saying about bringing their memories back to life.
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="bg-brand-surface rounded-[2.5rem] p-2 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Top White Card containing Rating and Quote */}
              <div className="bg-white rounded-[2rem] p-8 sm:p-10 flex-grow flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-6 font-bold text-gray-500 text-sm">
                  <span className="text-brand-black text-base">{item.rating}</span>
                  <Star size={14} className="fill-brand-orange text-brand-orange" />
                  Rating
                </div>

                {/* Quote */}
                <p className="text-xl font-[750] text-brand-black leading-snug tracking-tight">
                  {item.quote}
                </p>
              </div>

              {/* Author Info sitting on the gray background */}
              <div className="flex items-center gap-4 px-6 py-5 mt-1">
                <img
                  src={item.author.image}
                  alt={item.author.name}
                  className="w-12 h-12 rounded-full object-cover grayscale-[0.1]"
                />
                <div>
                  <div className="font-bold text-brand-black text-base">{item.author.name}</div>
                  <div className="text-sm text-gray-500 font-medium">{item.author.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
