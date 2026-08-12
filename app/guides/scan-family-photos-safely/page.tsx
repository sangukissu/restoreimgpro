import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ScanLine, Camera, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, ExternalLink, HardDrive, FileText, Image as ImageIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Scan Old Family Photos Without Damaging Them (DPI, Glare, Stuck Glass)",
  description:
    "Scan old family photos safely for AI restoration: DPI table, glare and Newton rings fixes, phone-scan failure checklist, stuck glass prints, 3-2-1 backup, and a good-enough-for-AI acceptance test. NARA/FADGI-aligned safety notes.",
  alternates: { canonical: "/guides/scan-family-photos-safely" },
}

const TOC_ITEMS = [
  { id: "pre-scan-handling", title: "1. Pre-scan handling & cleaning" },
  { id: "dpi-matrix", title: "2. DPI & format table" },
  { id: "software-rules", title: "3. Scanner software settings" },
  { id: "hardware-setup", title: "4. Flatbed vs phone" },
  { id: "phone-failure", title: "5. Phone-scan failure checklist" },
  { id: "glare-troubleshoot", title: "6. Glare: prints vs film" },
  { id: "stuck-photos", title: "7. Stuck glass & sticky albums" },
  { id: "acceptance-test", title: "8. Good enough for AI restore" },
  { id: "archival-backup", title: "9. 3-2-1 backup" },
  { id: "restore-next", title: "10. Next: restore" },
  { id: "faq", title: "FAQ" },
]

export default function ScanGuidePage() {
  return (
    <GuideLayout
      title="How to scan old family photos without damaging them (DPI, glare, stuck glass)"
      description="Protect fragile prints while capturing enough detail for AI restoration. DPI table, phone pitfalls, glare fixes, stuck-glass rules, and a simple acceptance test before you spend credits."
      updated="August 12, 2026"
      crumbs={[{ name: "Scan family photos safely" }]}
      toc={TOC_ITEMS}
    >
      <div className="space-y-12 text-brand-black">

        {/* 1. Pre-Scan Physical Handling */}
        <section id="pre-scan-handling" className="scroll-mt-36 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            1. Pre-Scan Physical Handling &amp; Cleaning Protocol
          </h2>
          
          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
            The mathematical accuracy of your AI restoration depends directly on digital input clarity. However, chasing maximum resolution should never put fragile 100-year-old silver gelatin, albumin, or tintype prints at risk. Before feeding your scans into our tool to{" "}
            <Link href="/old-photo-restoration" className="text-brand-orange underline font-bold hover:text-brand-black transition-colors">
              repair damaged vintage prints with AI
            </Link>, follow strict conservator handling rules:
          </p>

          <div className="space-y-3 pt-2">
            <div className="border-l-2 border-brand-orange pl-4 py-1">
              <h3 className="font-extrabold text-brand-black text-base">Cleaning Scanner Glass vs. Cleaning Photos</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed mt-1">
                <strong>Scanner Glass:</strong> Clean using a optical microfiber cloth and lens cleaner. Spray cleaner onto the cloth, <em>never directly on scanner glass</em> to prevent liquid seeping under the bezel.<br />
                <strong>Paper Prints:</strong> Lightly brush away loose dust with a soft camel-hair anti-static brush. <strong>Never use water, alcohol, or liquid wipes on photo paper</strong>—liquids swell the gelatin emulsion layer and destroy silverhalide particles.
              </p>
            </div>

            <div className="border-l-2 border-brand-orange pl-4 py-1">
              <h3 className="font-extrabold text-brand-black text-base">Handling Brittle or Curled Paper</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed mt-1">
                Brittle vintage prints often crack along paper fibers under heavy lid pressure. Never force curled prints flat using heavy books or high scanner cover force. Instead, allow prints to rest in a room with 40-50% relative humidity, or use a foam backing pad for gentle, uniform contact.
              </p>
            </div>
          </div>
        </section>

        {/* 2. DPI Resolution & Format Table */}
        <section id="dpi-matrix" className="scroll-mt-36 space-y-6 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            2. Recommended Scanner DPI &amp; Format Specifications
          </h2>
          
          <p className="text-gray-700 font-medium leading-relaxed">
            Dots Per Inch (DPI) dictates pixel density. Selecting too low a DPI starves AI neural models of necessary facial landmark geometry (eyelashes, pupil boundaries, skin texture), while excessively high DPI on large prints only magnifies paper grain without adding real detail.
          </p>

          {/* Technical Specs Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm text-brand-black border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-xs font-extrabold uppercase tracking-wider text-gray-600">
                  <th className="p-4">Original Print Size</th>
                  <th className="p-4">Target Output Intent</th>
                  <th className="p-4">Recommended DPI</th>
                  <th className="p-4">Output Dimensions</th>
                  <th className="p-4">File Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold">Standard 4x6" Print</td>
                  <td className="p-4 text-gray-600">1:1 Digital Archive Copy</td>
                  <td className="p-4 font-bold text-gray-700">300 DPI</td>
                  <td className="p-4 text-gray-600">1200 x 1800 px</td>
                  <td className="p-4 text-gray-600">JPG (High Quality)</td>
                </tr>
                <tr className="bg-brand-orange/5 hover:bg-brand-orange/10 font-bold">
                  <td className="p-4 text-brand-black">Standard 4x6" Print</td>
                  <td className="p-4 text-brand-orange">Best for AI Restoration</td>
                  <td className="p-4 text-brand-orange">600 DPI</td>
                  <td className="p-4 text-brand-black">2400 x 3600 px</td>
                  <td className="p-4 text-brand-black">TIFF / PNG (Uncompressed)</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold">Wallet Print (2x3")</td>
                  <td className="p-4 text-gray-600">Enlargement &amp; AI Repair</td>
                  <td className="p-4 font-bold text-gray-700">600 – 1200 DPI</td>
                  <td className="p-4 text-gray-600">1800 x 2700 px+</td>
                  <td className="p-4 text-gray-600">TIFF (Uncompressed)</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold">Tiny Locket Photo (1x1")</td>
                  <td className="p-4 text-gray-600">Wall Frame Enlargement (8x10")</td>
                  <td className="p-4 font-bold text-gray-700">1200 – 2400 DPI</td>
                  <td className="p-4 text-gray-600">1200 x 1200 px+</td>
                  <td className="p-4 text-gray-600">TIFF (Uncompressed)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Essential Scanner Software Settings */}
        <section id="software-rules" className="scroll-mt-36 space-y-6 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            3. Essential Scanner Software Settings
          </h2>
          
          <p className="text-gray-700 font-medium leading-relaxed">
            Default scanner software is designed for office documents, applying heavy contrast and sharpening that ruin photographic neural inputs.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 border-l-2 border-brand-orange pl-4 py-1">
              <h3 className="font-extrabold text-brand-black text-base">Disable All Auto-Enhancement Filters</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Turn <strong>OFF</strong> hardware settings such as <em>Auto-Sharpen</em>, <em>Auto-Color Fix</em>, and <em>Descreening</em>. Hardware sharpening creates harsh halo artifacts around eyes and hair that confuse deep learning facial models.
              </p>
            </div>

            <div className="space-y-2 border-l-2 border-brand-orange pl-4 py-1">
              <h3 className="font-extrabold text-brand-black text-base">Always Scan in 24-Bit RGB Color</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Even for black-and-white or sepia photographs, <strong>always scan in 24-bit RGB Color mode</strong>. Grayscale scanning discards subtle paper aging signals, handwritten back-of-photo ink notes, and shadow tonality that AI models use to infer facial depth. You can always use our tool to{" "}
                <Link href="/denoise-photos" className="text-brand-orange underline font-bold hover:text-brand-black transition-colors">
                  remove high-ISO film grain
                </Link>{" "}
                later.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Flatbed vs Smartphone Setup */}
        <section id="hardware-setup" className="scroll-mt-36 space-y-6 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            4. Flatbed scanner vs smartphone copy setup
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Flatbed Scanner */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <ScanLine size={20} className="text-brand-orange" />
                <h3 className="text-xl font-extrabold text-brand-black">Flatbed scanner for loose prints</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                A flatbed gives even lighting and consistent alignment when a loose print fits fully on the glass and can lie flat without force.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Place the print face-down gently and keep the entire original inside the scanner bed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Do not press a curled, brittle, or oversized print flat with the lid. Photograph it with a copy setup if closing the scanner could crease or crush it.</span>
                </li>
              </ul>
            </div>

            {/* Smartphone Setup */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Camera size={20} className="text-brand-orange" />
                <h3 className="text-xl font-extrabold text-brand-black">Smartphone copy setup</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                A phone can make a usable copy when it is held stable and parallel and the print is lit evenly. The result matters more than the phone model or camera label.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Use indirect daylight or two matching diffused lights. Avoid mixed light colours and direct reflections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Hold phone strictly parallel to photo surface using a tripod or copy stand to eliminate perspective skew.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Use the sharpest optical camera available without digital zoom. Fill the frame, then turn off flash, portrait effects, and beauty filters.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="phone-failure" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            5. Phone-scan failure checklist
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            A phone copy is usable only when the important detail is sharp, evenly lit, and square to the camera. Reshoot if any of these problems hides a face or damaged area you want restored:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium text-sm">
            <li>Print not filling the frame (lots of table/background = fewer face pixels).</li>
            <li>Perspective skew (phone not parallel → trapezoid print).</li>
            <li>Uneven light or hard shadow across the face.</li>
            <li>Visible glare hotspots on glossy paper.</li>
            <li>Motion blur or focus on the table instead of emulsion.</li>
            <li>Beauty mode / HDR ghosting / heavy JPEG recompression from messaging apps.</li>
            <li>Finger over the edge or curved album page without holding flat safely.</li>
          </ul>
        </section>

        <section id="glare-troubleshoot" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            6. Glare on prints and Newton rings on film
          </h2>
          <div className="space-y-5 text-gray-700 font-medium text-sm">
            <div>
              <h3 className="font-extrabold text-brand-black">Glossy photographic prints</h3>
              <p className="mt-1 leading-relaxed">For a phone copy, turn off flash and place two matching diffused lights at roughly 45° on opposite sides. Keep the camera parallel. If a print cannot lie on scanner glass safely, do not add pressure or improvised spacers; photograph it instead.</p>
            </div>
            <div>
              <h3 className="font-extrabold text-brand-black">Negatives, slides, and transparency film</h3>
              <p className="mt-1 leading-relaxed">Newton rings are a common film-scanning problem when curled transparency material contacts glass. Use the scanner&apos;s film holder and follow its orientation instructions. Some manufacturers recommend reversing the film orientation when rings appear. Anti-Newton-ring glass or fluid mounting belongs to a specialist film workflow, not routine print scanning.</p>
            </div>
            <div>
              <h3 className="font-extrabold text-brand-black">Prints stuck to frame glass</h3>
              <p className="mt-1 leading-relaxed">Do not peel the photograph away. Photograph or scan through the existing glass if it can be done without disturbing the object, and consult a photograph conservator when separation matters.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Primary safety references:{" "}
            <a href="https://www.archives.gov/preservation/family-archives/digitizing" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline font-bold">NARA digitizing family papers</a>
            {" "}and{" "}
            <a href="https://www.digitizationguidelines.gov/guidelines/digitize-technical.html" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline font-bold">FADGI technical guidelines</a>.
            We are not a paper conservation lab—when in doubt, stop and consult a conservator.
          </p>
        </section>

        {/* 7. Photos Stuck to Glass & Sticky Albums */}
        <section id="stuck-photos" className="scroll-mt-36 space-y-6 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            7. Handling Photos Stuck to Glass &amp; Sticky Albums
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4 py-1 space-y-2">
              <div className="flex items-center gap-2 text-brand-black font-extrabold text-lg">
                <AlertTriangle size={18} className="text-amber-500" />
                <h3>Photos Stuck to Frame Glass: Do NOT Peel</h3>
              </div>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                If a historic photograph has adhered to glass inside its frame over decades of humidity, <strong>do not attempt to peel it apart physically or apply a hairdryer</strong>. Forced separation tears the emulsion (the gelatin image layer) straight off the paper, causing permanent destruction.
              </p>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                <strong>Safe Workaround:</strong> Remove frame backing and matting so only glass + photo remain. Place the assembly glass-side down directly on your scanner glass, or photograph through glass using angled 45-degree side lighting.
              </p>
            </div>

            <div className="border-l-4 border-gray-400 pl-4 py-1 space-y-2">
              <h3 className="font-extrabold text-brand-black text-base">1970s Magnetic "Sticky" Albums</h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Acidic yellowing adhesive in vintage magnetic albums hardens over time. Rather than peeling fragile paper, scan the entire album page at 600 DPI, or carefully un-clip page binders to lay pages flat on your scanner bed.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Physical Archiving & 3-2-1 Backup */}
        <section id="archival-backup" className="scroll-mt-36 space-y-6 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            9. Physical storage &amp; 3-2-1 digital backup
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 border-l-2 border-brand-black/20 pl-4 py-1">
              <h3 className="font-extrabold text-brand-black text-base">Physical Archival Storage</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                After scanning, store original prints in acid-free, lignin-free archival boxes and Mylar (polyethylene) transparent sleeves. Keep physical storage in living areas (30–50% relative humidity) away from damp basements or hot attics.
              </p>
            </div>

            <div className="space-y-2 border-l-2 border-brand-black/20 pl-4 py-1">
              <h3 className="font-extrabold text-brand-black text-base">The Digital 3-2-1 Backup Rule</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Maintain <strong>3</strong> total copies of your digitized master scans, across <strong>2</strong> different media types (e.g., local SSD + external hard drive), with <strong>1</strong> copy stored off-site in encrypted cloud storage.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="https://www.archives.gov/preservation/family-archives/digitizing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 text-sm font-extrabold text-brand-black hover:border-brand-orange transition-colors"
            >
              <span>US National Archives Digitization Standard</span>
              <ExternalLink size={15} className="text-brand-orange" />
            </a>
            <a
              href="https://www.digitizationguidelines.gov/guidelines/digitize-technical.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 text-sm font-extrabold text-brand-black hover:border-brand-orange transition-colors"
            >
              <span>FADGI Federal Guidelines</span>
              <ExternalLink size={15} className="text-brand-orange" />
            </a>
          </div>
        </section>

        <section id="acceptance-test" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            8. “Good enough for AI restore” acceptance test
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Only spend restore credits when the digital file passes this bar:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 font-medium text-sm">
            <li>File opens and is not corrupt (if not, use file repair—not BringBack).</li>
            <li>At 100% zoom, eyes and mouth edges are visible—not pure blur.</li>
            <li>No large white glare blob covering the face.</li>
            <li>Print fills most of the frame; faces for portraits ideally 200px+ tall when cropped.</li>
            <li>You kept a raw/high-quality master (TIFF/PNG or high-quality JPEG) plus a 3-2-1 backup plan.</li>
          </ol>
          <p className="text-sm text-gray-600 font-medium">
            Then restore (1 credit). For likeness-sensitive merges, also read{" "}
            <Link href="/guides/choose-source-photos-for-likeness" className="text-brand-orange underline font-bold">
              source photos for likeness
            </Link>
            {" "}and{" "}
            <Link href="/guides/family-photo-metadata-checklist" className="text-brand-orange underline font-bold">
              metadata checklist
            </Link>.
          </p>
        </section>

        {/* Preparing Scans for BringBack AI — CTA only after ready criteria */}
        <section id="restore-next" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <div className="bg-brand-black text-white p-8 sm:p-10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-2xl font-extrabold mb-2">Scan ready? Restore next</h3>
              <p className="text-gray-300 font-medium text-sm max-w-md">
                Only after the acceptance test above. Upload a clean scan to repair scratches, stains, and fade—then compare identity side by side.
              </p>
            </div>
            <Link
              href="/old-photo-restoration"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-white hover:text-brand-black transition-colors shrink-0 shadow-md"
            >
              <span>Open restoration tool</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section id="faq" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-brand-black">What DPI should I scan old photos for AI restoration?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">For a standard 4×6&quot; print intended for restoration or enlargement, 600 DPI is a practical target. A 300 DPI scan can be adequate for same-size viewing but records less facial and surface detail.</p>
            </div>
            <div>
              <h3 className="font-bold text-brand-black">Can I scan with my phone instead of a flatbed?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">Yes if the print fills the frame, lighting is even, and there is no glare. Use the phone failure checklist above.</p>
            </div>
            <div>
              <h3 className="font-bold text-brand-black">What if the photo is stuck to the glass?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">Do not peel. Scan or photograph through the glass with care, or consult a conservator for separation.</p>
            </div>
            <div>
              <h3 className="font-bold text-brand-black">Will AI fix a bad scan?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">AI can repair some damage but cannot invent true detail missing from a tiny, blurry, or glare-blown face. Rescan first when possible.</p>
            </div>
          </div>
        </section>

      </div>
    </GuideLayout>
  )
}
