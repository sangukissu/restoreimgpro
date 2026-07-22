"use client";
import React from 'react';
import { 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  UserPlus, 
  Eraser, 
  BookOpen, 
  FolderOpen, 
  Send, 
  Heart, 
  Coins 
} from 'lucide-react';

interface FeatureItem {
  name: string;
  cost: string;
  description: string;
  icon: React.ReactNode;
  unlockedOn: string;
}

export const FeatureDirectory: React.FC = () => {
  const features: FeatureItem[] = [
    {
      name: "AI Photo Restoration",
      cost: "1 Credit",
      description: "Repair tears, fix deep scratches, correct color fading, and upscale resolution in seconds.",
      icon: <ImageIcon size={20} />,
      unlockedOn: "All Tiers"
    },
    {
      name: "Cinematic Photo Animation",
      cost: "10 Credits",
      description: "Bring historical family faces to life with realistic, high-definition video animations.",
      icon: <Film size={20} />,
      unlockedOn: "All Tiers"
    },
    {
      name: "AI Family Portrait Creator",
      cost: "2 Credits",
      description: "Combine multiple individual photos of different relatives into a single high-quality studio family group portrait.",
      icon: <Sparkles size={20} />,
      unlockedOn: "All Tiers"
    },
    {
      name: "AI Nostalgic Hug Generator",
      cost: "19 Credits",
      description: "Experimental reunion/hug video from two photos. Review quality carefully; not available on the 4-credit Starter pack.",
      icon: <Heart size={20} />,
      unlockedOn: "Value & Family packs"
    },
    {
      name: "Add Person to Photo",
      cost: "2 Credits",
      description: "Generatively insert a missing family member or deceased loved one into any existing family photograph.",
      icon: <UserPlus size={20} />,
      unlockedOn: "All Tiers"
    },
    {
      name: "Remove Person / Object",
      cost: "2 Credits",
      description: "Generatively erase unwanted background elements, clutter, or photobombers from your images.",
      icon: <Eraser size={20} />,
      unlockedOn: "All Tiers"
    },
    {
      name: "Memory Book Creator",
      cost: "Free to Edit",
      description: "Compile restored photos and custom family stories into a private, beautifully paginated interactive memory book.",
      icon: <BookOpen size={20} />,
      unlockedOn: "Family Pack Exclusive"
    },
    {
      name: "Private Media Library",
      cost: "Free Access",
      description: "Store, organize, download, and manage restorations and animations in one dashboard until you delete them.",
      icon: <FolderOpen size={20} />,
      unlockedOn: "All Tiers"
    }
  ];

  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-brand-bg/50 border-t border-gray-100">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Dashboard Features <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black leading-[1.05]">
              Exact credit costs. <br />
              <span className="text-gray-400">No surprises.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Starter can restore and reunite, but not animate. Value and Family packs cover higher-cost tools. Credits never expire.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const isExclusive = feat.unlockedOn.includes("Exclusive");
            return (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row with Icon & Credit Pill */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-md">
                        <Coins size={10} />
                        {feat.cost}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-extrabold text-brand-black mb-2">{feat.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">{feat.description}</p>
                </div>

                {/* Footer Availability Banner */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-gray-400">Availability</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    isExclusive 
                      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {feat.unlockedOn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
