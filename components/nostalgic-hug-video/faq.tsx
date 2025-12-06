"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQS: FAQItem[] = [
    {
        question: "How does the Nostalgic Hug video generation work?",
        answer: "Our advanced AI analyzes two separate photos—one of you and one of your loved one. It inherently understands the geometry and emotion of a hug, then seamlessly blends the two people into a realistic video where they embrace. It's not just an overlay; it's a completely generated new memory."
    },
    {
        question: "What kind of photos work best?",
        answer: "For the best results, use clear photos where the person is facing forward or slightly to the side. Avoid photos where the face is obscured or very blurry. Full-body or half-body shots work well. You need one photo for each person."
    },
    {
        question: "Can I use old or damaged photos?",
        answer: "Yes! However, we highly recommend using our Photo Restoration tool first to repair any damage and sharpen the details. The clearer the input photo, the more realistic and heartwarming the final hug video will be."
    },
    {
        question: "Is this private? Will my photos be shared?",
        answer: "Your privacy is our top priority. The photos you upload and the videos we generate are completely private. We do not use your personal family photos to train our AI models, and all media is automatically deleted from our servers shortly after processing."
    },
    {
        question: "How long does it take to create a video?",
        answer: "The process is incredibly fast. Once you upload your photos, our AI typically generates the scene and the final video within 2-3 minutes. You can download it immediately afterwards."
    },
    {
        question: "What if I don't like the result?",
        answer: "AI video generation is complex, and results can vary based on the input photos. If the result isn't perfect, we recommend trying with different photo angles. We also offer a satisfaction guarantee—if you're having trouble getting a good result, our support team is happy to help."
    },
    {
        question: "Can I share the video on social media?",
        answer: "Absolutely. The video is yours to keep. It's delivered in a standard MP4 format that works perfectly on Instagram, TikTok, Facebook, WhatsApp, and more."
    }
];

const AccordionItem: React.FC<{
    item: FAQItem;
    isOpen: boolean;
    toggle: () => void
}> = ({ item, isOpen, toggle }) => {
    return (
        <div
            onClick={toggle}
            className={`bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 cursor-pointer group ${isOpen ? 'shadow-sm' : 'hover:bg-gray-50'}`}
        >
            <div className="p-6 flex justify-between items-center gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-brand-black leading-tight select-none">
                    {item.question}
                </h3>

                {/* Toggle Button */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${isOpen ? 'bg-brand-orange text-white' : 'bg-gray-100 text-brand-black group-hover:bg-gray-200'
                    }`}>
                    {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
                </div>
            </div>

            {/* Content */}
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
            >
                <div className="overflow-hidden">
                    <p className="px-6 pb-8 text-gray-600 font-medium leading-relaxed text-base sm:text-lg max-w-3xl">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function NostalgicHugFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
            <div className="max-w-[1320px] mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Header Column */}
                    <div className="lg:col-span-5 sm:sticky top-32">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                            <span className="text-brand-orange">//</span> FAQs <span className="text-brand-orange">//</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
                            Common <br />
                            <span className="text-gray-400">Questions.</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
                            Everything you need to know about creating your Nostalgic Hug video.
                        </p>
                    </div>

                    {/* Questions Column - The Frame */}
                    <div className="lg:col-span-7">
                        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
                            <div className="flex flex-col gap-3">
                                {FAQS.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        item={faq}
                                        isOpen={openIndex === index}
                                        toggle={() => handleToggle(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
