import FrameDesigner from "@/components/frame-designer"

export default function Page() {
  return (
    <main className="min-h-dvh">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex flex-col items-start gap-4">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">BringBack.pro — Digital Frames</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Upload a photo, choose a frame style, preview instantly, and export a print-ready PNG. Frames dynamically
            adapt to your image size and aspect ratio. When supported, face detection helps keep subjects comfortably in
            view.
          </p>
        </header>

        <FrameDesigner />
      </section>
    </main>
  )
}
