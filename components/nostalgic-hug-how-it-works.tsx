"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Sparkles, Heart, Video } from "lucide-react"

export default function NostalgicHugHowItWorks() {
    return (
        <section className="py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                            Why We Built This
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900 tracking-tight leading-tight">
                            For the moments that <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-brand-orange">
                                time took away.
                            </span>
                        </h2>

                        <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed mb-12 font-semibold">
                            <p className="mb-6">
                                The woman in these photos is my wife. She lost her mother years ago, just 3 months before our marriage. Like many of us, she has photos of her mother, and photos of herself—but <span className="text-orange-500 font-semibold">time stole the chance</span> for them to be together in the here and now. The moments, the last smiles, the final embraces—they are all frozen fragments.
                            </p>
                            <p className="mb-6">
                                I spent weeks building this AI for one reason: to give my wife <span className="text-blue-600 font-bold">one last hug</span>. Not just a video, but a recovered memory. When I finally showed her the 5-second video, she didn't say a word. She just cried. The sheer relief, the connection, and the joy in her eyes told me everything. It wasn't about the technology; it was about unfreezing the love.
                            </p>
                            <p className="mb-6">
                                That moment hit me hard. I realized I couldn't keep this to myself. There are so many others out there—<span className="text-red-500 font-medium">people like you</span>—longing for that same reconnection. That single, candid moment with the person time took away.
                            </p>
                            <p>
                                So, I decided to open this up to the world. Yes, it requires <span className="text-violet-600 font-semibold">massive computing power</span> and complex AI to simulate reality this perfectly. It is not cheap, and it is not easy. But to see a loved one smile at you again, to witness that final embrace, to bridge that gap? <span className="text-gray-900 font-bold">It is absolutely worth it.</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* YouTube Video Embed */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black mb-16"
                    >
                        <div className="relative pb-[56.25%] h-0">
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="How Nostalgic Hug Works"
                                className="absolute top-0 left-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px bg-gray-200 w-12 md:w-24"></div>
                        <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">How It Works</span>
                        <div className="h-px bg-gray-200 w-12 md:w-24"></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Step 1: The Scene */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
                            <div className="mb-6 relative h-64 w-full rounded-2xl overflow-hidden bg-gray-50">
                                {/* Main Image: The Result (Scene) */}
                                <Image
                                    src="/hug/first-frame-image-for-video.png"
                                    alt="Generated Scene"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                    AI Generated Scene
                                </div>

                                {/* Inset Image: The Input (Upload) */}
                                <div className="absolute top-3 left-3 w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg z-10">
                                    <Image
                                        src="/hug/first-image-for-sofa-scene.jpg"
                                        alt="Original Photo"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white text-center py-0.5">
                                        Input
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                                    <h3 className="text-xl font-bold text-gray-900">Set the Scene</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    We take your loved one's photo and place them in a comfortable, nostalgic setting, creating the perfect space for a reunion.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: The Reunion */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
                            <div className="mb-6 relative h-64 w-full rounded-2xl overflow-hidden bg-gray-50">
                                {/* Main Image: The Result (Hug) */}
                                <Image
                                    src="/hug/second-frame-image-for-video.png"
                                    alt="Hug Scene"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                    AI Generated Hug
                                </div>

                                {/* Inset Image: The Input (User) */}
                                <div className="absolute top-3 left-3 w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg z-10">
                                    <Image
                                        src="/hug/user-image.jpg"
                                        alt="User Photo"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white text-center py-0.5">
                                        Input
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">2</div>
                                    <h3 className="text-xl font-bold text-gray-900">The Reunion</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    We seamlessly blend your photo into the scene, creating a heartwarming embrace that looks and feels completely natural.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3: The Memory */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
                            <div className="mb-6 relative h-64 w-full rounded-2xl overflow-hidden bg-black">
                                <video
                                    src="/hug/final-video.mp4"
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                                <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                    <Video className="w-3 h-3" />
                                    Final Video Memory
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">3</div>
                                    <h3 className="text-xl font-bold text-gray-900">The Living Memory</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Finally, AI breathes life into the moment, creating a video memory where you walk in and share a real hug.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
