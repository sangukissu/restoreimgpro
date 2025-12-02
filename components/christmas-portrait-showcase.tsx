"use client"

import { Sparkles, Trees, Home, Snowflake, Gift } from "lucide-react"

export default function ChristmasPortraitShowcase() {
    const showcaseItems = [
        {
            title: "Cozy Hearth Scene",
            description: "Warm fireplace setting perfect for family gatherings",
            image: "/christmas-hearth-example.webp",
            icon: <Home size={24} />,
        },
        {
            title: "Snowy Landscape",
            description: "Beautiful winter wonderland backdrop",
            image: "/christmas-snowy-example.webp",
            icon: <Snowflake size={24} />,
        },
        {
            title: "Christmas Tree",
            description: "Classic holiday scene with festive decorations",
            image: "/christmas-tree-example.webp",
            icon: <Trees size={24} />,
        },
        {
            title: "Gift Exchange",
            description: "Joyful moments captured in holiday spirit",
            image: "/christmas-gift-example.webp",
            icon: <Gift size={24} />,
        },
    ]

    return (
        <section className="w-full">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-24 ">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-green-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
                            <span className="text-yellow-300">🎄</span> Christmas Feature <span className="text-yellow-300">🎄</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
                            Create magical <br />
                            <span className="text-gray-400">Christmas memories.</span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="max-w-sm">
                        <p className="text-base text-gray-600 font-medium leading-relaxed">
                            Transform separate photos into beautiful Christmas family portraits with festive holiday scenes.
                        </p>
                    </div>
                </div>

                {/* Showcase Grid Container */}
                <div className="bg-brand-surface p-3 rounded-[1.8rem]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {showcaseItems.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[1.5rem] p-5 flex flex-col gap-6 relative group h-full"
                            >
                                {/* Visual Area */}
                                <div className="h-48 w-full rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-inner relative bg-gradient-to-br from-red-50 to-green-50">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3 px-2 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center text-brand-black shrink-0">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-brand-black leading-tight">{item.title}</h3>
                                    </div>

                                    <p className="text-gray-500 font-medium leading-relaxed text-sm pl-[3.25rem]">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
