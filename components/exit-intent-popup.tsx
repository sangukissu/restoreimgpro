"use client"

import { useState, useEffect } from "react"
import { Sparkles, X, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExitIntentPopup({ hasPurchased }: { hasPurchased: boolean }) {
    const [showPopup, setShowPopup] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // If user has already purchased, or if they've seen the popup before, do nothing
        if (hasPurchased) return

        // Check if they've dismissed it before (in this browser)
        const hasSeenPopup = localStorage.getItem("hasSeenExitPopup")
        if (hasSeenPopup === "true") return

        const handleMouseOut = (e: MouseEvent) => {
            // If mouse moves out of the document at the top edge (intended to close tab or edit URL)
            if (!e.relatedTarget && e.clientY < 50) {
                setShowPopup(true)
                // Only trigger once
                document.removeEventListener("mouseout", handleMouseOut)
            }
        }

        document.addEventListener("mouseout", handleMouseOut)

        return () => {
            document.removeEventListener("mouseout", handleMouseOut)
        }
    }, [hasPurchased])

    const handleDismiss = () => {
        localStorage.setItem("hasSeenExitPopup", "true")
        setShowPopup(false)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText("WELCOME10")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleUseDiscount = () => {
        handleDismiss()
        // Open payment modal
        window.dispatchEvent(new Event('open-payment-modal'))
    }

    if (!showPopup) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300">

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                        <Sparkles className="w-6 h-6" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Wait! Before you go...
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed">
                        We noticed you haven't tried bringing your photos to life yet. We'd love for you to experience the magic of BringBack.
                    </p>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 my-6">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Use this code at checkout
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl font-black text-brand-orange tracking-wider font-mono">
                                WELCOME10
                            </span>
                            <button
                                onClick={handleCopy}
                                className="p-2 text-gray-500 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                                title="Copy code"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            For 10% off your first purchase!
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Button
                            onClick={handleUseDiscount}
                            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-brand-orange/20"
                        >
                            Get Credits Now
                        </Button>
                        <button
                            onClick={handleDismiss}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-800 font-medium py-2 transition-colors"
                        >
                            No thanks, maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
