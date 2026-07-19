"use client";

import { Shield, Lock, EyeOff, UserCheck } from "lucide-react";

export function AIAnimationPrivacy() {
  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
       {/* Background accents */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            
            <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-2xl mb-6 text-brand-orange">
                    <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                Your Memories Stay Private
                </h2>
                <h3 className="text-xl text-gray-300 leading-relaxed mb-8">
                    Generated media stays in your account until you delete it. We do not use your family photos to train general-purpose AI models.
                </h3>
            </div>

            <div className="flex-1 w-full space-y-4">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange shrink-0">
                        <EyeOff className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">You control media</h4>
                        <p className="text-gray-400 text-sm">Animations remain in My Media so you can re-download. Delete anytime from your dashboard.</p>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange shrink-0">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">No public model training</h4>
                        <p className="text-gray-400 text-sm">We do not use your personal family photos to train general-purpose AI models for public release.</p>
                    </div>
                </div>

                 <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange shrink-0">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">Clear credit cost</h4>
                        <p className="text-gray-400 text-sm">Animation costs 10 credits. The 4-credit Restoration Starter cannot fund an animation alone.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
