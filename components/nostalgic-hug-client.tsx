"use client"

import { useState } from "react"
import { Upload, Loader2, Video, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface NostalgicHugClientProps {
    user: {
        email: string
        id: string
    }
    initialCredits: number
    isPaymentSuccess: boolean
}

export default function NostalgicHugClient({ user, initialCredits, isPaymentSuccess }: NostalgicHugClientProps) {
    const router = useRouter()
    const [credits, setCredits] = useState(initialCredits)
    const [loading, setLoading] = useState(false)

    const [personAFile, setPersonAFile] = useState<File | null>(null)
    const [personBFile, setPersonBFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const checkCredits = (cost: number) => {
        if (credits < cost) {
            toast.error(`Insufficient credits. This process requires ${cost} credits.`)
            return false
        }
        return true
    }

    const compressImage = async (file: File): Promise<File> => {
        if (file.size <= 4 * 1024 * 1024) {
            return file
        }

        return new Promise((resolve, reject) => {
            const img = new window.Image()
            img.src = URL.createObjectURL(file)
            img.onload = () => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")
                if (!ctx) {
                    resolve(file)
                    return
                }

                const MAX_WIDTH = 2048
                const MAX_HEIGHT = 2048
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height *= MAX_WIDTH / width))
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width *= MAX_HEIGHT / height))
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name, {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            })
                            resolve(newFile)
                        } else {
                            resolve(file)
                        }
                    },
                    "image/jpeg",
                    0.95
                )
            }
            img.onerror = () => resolve(file)
        })
    }

    const generateVideo = async () => {
        if (!personAFile || !personBFile) return
        if (!checkCredits(19)) return

        setLoading(true)
        try {
            const compressedFileA = await compressImage(personAFile)
            const compressedFileB = await compressImage(personBFile)
            
            const formData = new FormData()
            formData.append("image1", compressedFileA)
            formData.append("image2", compressedFileB)

            const response = await fetch("/api/nostalgic-hug/video", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate video")
            }

            setCredits(data.creditsRemaining)
            toast.success("Video generation started! You will be redirected to My Media to view the progress.")

            setTimeout(() => {
                router.push("/dashboard/my-media")
            }, 2000)

        } catch (error: any) {
            toast.error(error.message)
            setLoading(false)
        }
    }

    const LoadingState = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">{message}</h3>
                <div className="space-y-1">
                    <p className="text-gray-600 font-medium">
                        Please do not refresh or close the browser.
                    </p>
                    <p className="text-sm text-gray-500">
                        Uploading your images and starting the AI generation process...
                    </p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen relative">
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                        backgroundPosition: "0 0, 12px 12px",
                    }}
                />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 sm:px-8 py-6">
                <div className="mb-10 text-center">
                    <h1 className="font-inter font-bold text-3xl sm:text-4xl text-black mb-2">
                        Nostalgic Hug
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Reconnect with your loved ones through the power of AI. Create a heartwarming video of a hug that transcends time.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Card className="border-4 border-gray-200 rounded-3xl shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                        <CardContent className="p-8 sm:p-12">
                            {loading ? (
                                <LoadingState message="Starting Video Generation..." />
                            ) : (
                                <>
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold mb-2">Upload Your Photos</h2>
                                        <p className="text-gray-500">Upload a photo of your loved one and a photo of yourself.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        {/* Image 1 Upload */}
                                        <div className="flex flex-col items-center gap-4">
                                            <h3 className="font-medium text-gray-900">1. Loved One (e.g., Grandparent)</h3>
                                            <div className="w-full">
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors relative group bg-white">
                                                    <Input
                                                        id="personA"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, setPersonAFile)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        disabled={loading}
                                                    />
                                                    {!personAFile ? (
                                                        <div className="space-y-4 py-4">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                                <Upload className="w-8 h-8 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Upload Loved One</p>
                                                                <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-md">
                                                            <Image
                                                                src={URL.createObjectURL(personAFile)}
                                                                alt="Loved One Preview"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="text-white font-medium">Change Photo</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image 2 Upload */}
                                        <div className="flex flex-col items-center gap-4">
                                            <h3 className="font-medium text-gray-900">2. You (or second person)</h3>
                                            <div className="w-full">
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors relative group bg-white">
                                                    <Input
                                                        id="personB"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, setPersonBFile)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        disabled={loading}
                                                    />
                                                    {!personBFile ? (
                                                        <div className="space-y-4 py-4">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                                <Upload className="w-8 h-8 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Upload Your Photo</p>
                                                                <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-md">
                                                            <Image
                                                                src={URL.createObjectURL(personBFile)}
                                                                alt="Your Photo Preview"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="text-white font-medium">Change Photo</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center mt-8 pt-6 border-t border-gray-100">
                                        <Button
                                            onClick={generateVideo}
                                            disabled={!personAFile || !personBFile || loading || credits < 19}
                                            className="w-full max-w-md bg-black hover:bg-gray-800 text-white h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center py-2"
                                        >
                                            <div className="flex items-center">
                                                <Video className="mr-2 h-5 w-5" />
                                                Generate Hug Video
                                            </div>
                                            <span className="text-xs text-gray-300 font-normal mt-0.5">(19 Credits)</span>
                                        </Button>
                                        
                                        {credits < 19 && (
                                            <p className="text-sm text-red-500 font-medium mt-3">
                                                You need 19 credits for the Nostalgic Hug process.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Guidelines Section */}
                <div className="max-w-4xl mx-auto mt-12 mb-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6">
                        <div className="flex flex-col items-start gap-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-amber-100 p-2 rounded-full shrink-0">
                                    <Sparkles className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">For Best Results</h3>
                            </div>

                            <div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        <span><strong>One Person Per Photo:</strong> Please upload photos containing only one person. The AI focuses on a single subject for the best quality.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        <span><strong>Clear Faces:</strong> Ensure the face is clearly visible and not blurry.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        <span><strong>Restore First:</strong> If your photo is old, damaged, or blurry, please use our <a href="/dashboard/restore" className="text-amber-700 font-semibold hover:underline">Photo Restoration</a> tool first to enhance it.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
