"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Loader2, ArrowRight, Video, Download, RefreshCw, ArrowLeft, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface NostalgicHugClientProps {
    user: {
        email: string
        id: string
    }
    initialCredits: number
    isPaymentSuccess: boolean
}

export default function NostalgicHugClient({ user, initialCredits, isPaymentSuccess }: NostalgicHugClientProps) {
    const [credits, setCredits] = useState(initialCredits)

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Step 1 State
    const [personAFile, setPersonAFile] = useState<File | null>(null)
    const [sofaImageUrl, setSofaImageUrl] = useState<string | null>(null)

    // Step 2 State
    const [personBFile, setPersonBFile] = useState<File | null>(null)
    const [hugImageUrl, setHugImageUrl] = useState<string | null>(null)

    // Step 3 State
    const [videoUrl, setVideoUrl] = useState<string | null>(null)



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const checkCredits = (cost: number, stepName: string = "") => {
        if (credits < cost) {
            toast.error(`Insufficient credits. ${stepName} requires ${cost} credits to complete the flow.`)
            return false
        }
        return true
    }

    const compressImage = async (file: File): Promise<File> => {
        // Only compress if the file is larger than 4MB. 
        // Small/low-quality files are left completely untouched!
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

                // Increase max dimensions to preserve high quality for large files
                // The AI model processes at 1K (1024x1024) anyway, so 2048 is more than enough
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
                    0.95 // High quality setting
                )
            }
            img.onerror = () => resolve(file)
        })
    }

    const generateSofaImage = async () => {
        if (!personAFile) return
        if (!checkCredits(19, "The full nostalgic hug process")) return

        setLoading(true)
        try {
            const compressedFile = await compressImage(personAFile)
            const formData = new FormData()
            formData.append("image", compressedFile)

            const response = await fetch("/api/nostalgic-hug/sofa", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image")
            }

            setSofaImageUrl(data.imageUrl)
            setCredits(data.creditsRemaining)
            setStep(2)
            toast.success("Sofa image generated successfully!")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const generateHugImage = async () => {
        if (!personBFile || !sofaImageUrl) return
        if (!checkCredits(17, "The remaining steps")) return

        setLoading(true)
        try {
            const compressedFile = await compressImage(personBFile)
            const formData = new FormData()
            formData.append("image", compressedFile)
            formData.append("sofaImageUrl", sofaImageUrl)

            const response = await fetch("/api/nostalgic-hug/hug", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate hug image")
            }

            setHugImageUrl(data.imageUrl)
            setCredits(data.creditsRemaining)
            setStep(3)
            toast.success("Hug image generated successfully!")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const generateVideo = async () => {
        if (!sofaImageUrl || !hugImageUrl) return
        if (!checkCredits(15, "The final video generation")) return

        setLoading(true)
        try {
            const response = await fetch("/api/nostalgic-hug/video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sofaImageUrl,
                    hugImageUrl,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate video")
            }

            setCredits(data.creditsRemaining)
            toast.success("Video generation started! You will be redirected to My Media to view the progress.")

            // Redirect to My Media after a short delay
            setTimeout(() => {
                window.location.href = "/dashboard/my-media"
            }, 2000)

        } catch (error: any) {
            toast.error(error.message)
            setLoading(false)
        }
    }

    const resetFlow = () => {
        setStep(1)
        setPersonAFile(null)
        setSofaImageUrl(null)
        setPersonBFile(null)
        setHugImageUrl(null)
        setVideoUrl(null)
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
                        This process involves complex AI generation and may take 30-90 seconds.
                    </p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen relative">
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 opacity-30">
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

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors ${step >= 1 ? "border-black bg-black text-white" : "border-gray-300 text-gray-300"}`}>1</div>
                        <div className={`w-16 h-1 transition-colors ${step >= 2 ? "bg-black" : "bg-gray-200"}`} />
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors ${step >= 2 ? "border-black bg-black text-white" : "border-gray-300 text-gray-300"}`}>2</div>
                        <div className={`w-16 h-1 transition-colors ${step >= 3 ? "bg-black" : "bg-gray-200"}`} />
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors ${step >= 3 ? "border-black bg-black text-white" : "border-gray-300 text-gray-300"}`}>3</div>
                    </div>
                </div>

                <div className="grid gap-8 max-w-4xl mx-auto">
                    {/* Step 1: The Foundation */}
                    {step === 1 && (
                        <Card className="border-4 border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                            <CardContent className="p-8 sm:p-12">
                                {loading ? (
                                    <LoadingState message="Generating the Scene..." />
                                ) : (
                                    <>
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold mb-2">Step 1: The Foundation</h2>
                                            <p className="text-gray-500">Upload a photo of your loved one (e.g., Grandparent)</p>
                                        </div>

                                        <div className="flex flex-col items-center gap-8">
                                            <div className="w-full max-w-md">
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors relative group">
                                                    <Input
                                                        id="personA"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, setPersonAFile)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        disabled={loading}
                                                    />
                                                    {!personAFile ? (
                                                        <div className="space-y-4">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                                <Upload className="w-8 h-8 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Click to upload photo</p>
                                                                <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-md">
                                                            <Image
                                                                src={URL.createObjectURL(personAFile)}
                                                                alt="Preview"
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

                                            <Button
                                                onClick={generateSofaImage}
                                                disabled={!personAFile || loading || credits < 19}
                                                className="w-full max-w-xs bg-black hover:bg-gray-800 text-white h-10 text-md rounded-md"
                                            >
                                                Generate Scene
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                            {credits < 19 && (
                                                <p className="text-xs text-red-500">
                                                    You need 19 credits for the full Nostalgic Hug process.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: The Reunion */}
                    {step === 2 && (
                        <Card className="border-4 border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                            <CardContent className="p-8 sm:p-12">
                                {loading ? (
                                    <LoadingState message="Creating the Reunion..." />
                                ) : (
                                    <>
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold mb-2">Step 2: The Reunion</h2>
                                            <p className="text-gray-500">Upload your photo to join them</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <h3 className="font-medium text-gray-900">Scene Preview</h3>
                                                {sofaImageUrl && (
                                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md">
                                                        <Image
                                                            src={sofaImageUrl}
                                                            alt="Sofa Scene"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-full">
                                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors relative group">
                                                        <Input
                                                            id="personB"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, setPersonBFile)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            disabled={loading}
                                                        />
                                                        {!personBFile ? (
                                                            <div className="space-y-3">
                                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                                    <Upload className="w-6 h-6 text-gray-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">Upload Your Photo</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-md">
                                                                <Image
                                                                    src={URL.createObjectURL(personBFile)}
                                                                    alt="Preview"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={generateHugImage}
                                                    disabled={!personBFile || loading || credits < 17}
                                                    className="w-full bg-black hover:bg-gray-800 text-white h-10 rounded-md"
                                                >
                                                    Create Hug
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                                {credits < 17 && (
                                                    <p className="text-xs text-red-500">
                                                        You need 17 credits to complete the remaining steps.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: The Memory */}
                    {step === 3 && (
                        <div className="space-y-8">
                            <Card className="border-4 border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                                <CardContent className="p-8 sm:p-12">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold mb-2">Step 3: The Memory</h2>
                                        <p className="text-gray-500">Bring the moment to life with video</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-center text-gray-700">Start Frame</p>
                                            {sofaImageUrl && (
                                                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                    <Image src={sofaImageUrl} alt="Start" fill className="object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-center text-gray-700">End Frame</p>
                                            {hugImageUrl && (
                                                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                    <Image src={hugImageUrl} alt="End" fill className="object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!videoUrl && (
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={generateVideo}
                                                disabled={loading || credits < 15}
                                                className="w-full max-w-md bg-black text-white h-14 text-md rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center py-2"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center">
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Generating Video Magic...
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center">
                                                            <Video className="mr-2 h-5 w-5" />
                                                            Generate Video Memory
                                                        </div>
                                                        <span className="text-xs text-gray-300 mt-1">(15 Credits)</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {(!videoUrl && credits < 15) && (
                                        <p className="text-xs text-red-500 text-center mt-2">
                                            You need 15 credits to generate the final video.
                                        </p>
                                    )}

                                    {videoUrl && (
                                        <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                                            <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-black">
                                                <video
                                                    src={videoUrl}
                                                    controls
                                                    className="w-full h-full object-cover"
                                                    autoPlay
                                                    loop
                                                />
                                            </div>

                                            <div className="flex justify-center gap-4">
                                                <Button className="bg-black hover:bg-gray-800 text-white rounded-xl" onClick={() => window.open(videoUrl, '_blank')}>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Video
                                                </Button>
                                                <Button variant="outline" className="border-gray-300 rounded-xl" onClick={resetFlow}>
                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                    Create Another
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Guidelines Section */}
                <div className="max-w-4xl mx-auto mt-16 mb-8">
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
