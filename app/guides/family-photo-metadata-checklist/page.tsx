import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Family Photo Metadata Checklist: How to Organize Digital Archives | BringBack Guide",
  description:
    "A professional checklist for documenting family photos. Learn how to catalog names, dates, locations, and provenance using IPTC, EXIF, and Dublin Core standards.",
  alternates: { canonical: "/guides/family-photo-metadata-checklist" },
}

const TOC_ITEMS = [
  { id: "why-metadata", title: "1. Why Digital Metadata Matters" },
  { id: "metadata-schemas", title: "2. EXIF, IPTC, and Dublin Core" },
  { id: "six-pillars", title: "3. The 6 Archival Pillars Checklist" },
  { id: "naming-conventions", title: "4. Standard File Naming Conventions" },
  { id: "metadata-tools", title: "5. Cataloging Tools & Preservation" },
  { id: "stripping-warning", title: "6. Metadata Stripping Warning" },
]

export default function MetadataChecklistPage() {
  return (
    <GuideLayout
      title="Family Photo Metadata & Archival Checklist"
      description="Pixels without names become digital orphans. Learn how to record dates, locations, provenance, and back-of-photo inscriptions inside your restored photo files."
      updated="July 22, 2026"
      crumbs={[{ name: "Metadata checklist" }]}
      toc={TOC_ITEMS}
    >
      <div className="space-y-12 text-brand-black">

        {/* 1. Why Digital Metadata Matters */}
        <section id="why-metadata" className="scroll-mt-36 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            1. Why Digital Metadata Matters
          </h2>
          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
            Restoring a damaged vintage photograph to pristine quality using an{" "}
            <Link
              href="/old-photo-restoration"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              AI photo restoration tool
            </Link>{" "}
            is only half the preservation job. If future generations look at that beautifully
            restored photo fifty years from now, but have no way of knowing who the people are,
            where they stood, or what year the photo was taken, the historical connection is broken.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            Folders on your computer are not enough. Folder names can be changed, files get moved, and
            directory structures break. The only safe way to archive family photos is to write the
            historical details directly into the digital file itself as **metadata**. When you write
            metadata, the names and stories travel with the pixels forever.
          </p>
        </section>

        {/* 2. EXIF, IPTC, and Dublin Core */}
        <section id="metadata-schemas" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            2. The Three Digital Metadata Standards
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Professional archives, museums, and genealogy platforms organize digital images using three
            standards that reside in your photo files (JPEG, TIFF, or PNG):
          </p>

          <div className="overflow-x-auto -mx-2 px-2 pt-2">
            <table className="w-full text-sm font-medium border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-black">
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">Metadata Standard</th>
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">Purpose</th>
                  <th className="text-left py-3 font-extrabold text-brand-black">Typical Fields to Record</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">EXIF</td>
                  <td className="py-3 pr-4">Technical information captured automatically by cameras and scanners.</td>
                  <td className="py-3">Scan Date, Scanner Make/Model, Software Version.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">IPTC</td>
                  <td className="py-3 pr-4">Descriptive information added by humans. Industry standard for photo cataloging.</td>
                  <td className="py-3">Description/Caption, Keywords, Creator/Photographer, City, State, Country.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold">Dublin Core</td>
                  <td className="py-3 pr-4">Simplified web standard used by libraries, universities, and museum databases.</td>
                  <td className="py-3">Identifier, Date, Subject, Spatial Coverage, Source (Provenance).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. The 6 Archival Pillars Checklist */}
        <section id="six-pillars" className="scroll-mt-36 space-y-6 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            3. The 6 Archival Pillars Checklist
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            When cataloging a restored photo, make sure you record these six pillars of information
            in the IPTC Description or Caption field of the file:
          </p>

          <div className="space-y-6 pt-2">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-black">
                1. Subject Identification (Who)
              </h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                List the full names of every visible person. Use maiden names for women to aid family
                history searches. Always specify their positions from left to right.
              </p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                Example: &ldquo;Left to right: Eleanor Vance (maiden name Eleanor Brooks, grandmother), John Vance (father, age 4).&rdquo;
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-black">
                2. Date or Estimated Range (When)
              </h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Record the exact date if known. If the date is unknown, estimate the decade and list
                the clues you used (clothing styles, car models, or military badges). Use the prefix
                &ldquo;c.&rdquo; or &ldquo;ca.&rdquo; (circa) for estimated dates.
              </p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                Example: &ldquo;c. July 1944 (estimated from US Army uniform rank insignia).&rdquo;
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-black">
                3. Location Hierarchy (Where)
              </h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Record the location using a logical hierarchy from specific to broad: Landmark/Building,
                City, State, Country.
              </p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                Example: &ldquo;Vance homestead front porch, Springfield, Illinois, United States.&rdquo;
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-black">
                4. Occasion &amp; Context (What)
              </h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Describe what is happening in the photo. Name the event or historical context.
              </p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                Example: &ldquo;Family gathering immediately prior to John&apos;s deployment overseas during WWII.&rdquo;
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-black">
                5. Back-of-Photo Transcriptions
              </h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Old physical photos often contain handwriting, photographer stamps, or development dates
                on the reverse side. Always transcribe these word-for-word, including any question marks
                for illegible text.
              </p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                Example: &ldquo;Transcription of pencil note on back: &apos;Johnny before he left, keep safe, July 44?&apos; &rdquo;
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-black">
                6. Provenance &amp; Scan History
              </h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Document who owns the physical original photo, who scanned it, and when. This ensures
                the family archive can trace the origin of the digital file.
              </p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
                Example: &ldquo;Original 4x6 silver print held in physical album by Aunt Mary Vance; scanned at 600 DPI by Harvansh on July 22, 2026.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* 4. Standard File Naming Conventions */}
        <section id="naming-conventions" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            4. Standard File Naming Conventions
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            A consistent naming format prevents files from getting lost and keeps raw scans separate from
            AI-restored or colorized versions.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            Use the following convention: **[Date]_[FamilyName]_[ShortDescription]_[WorkflowMode].[extension]**
          </p>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 font-mono text-xs text-brand-black space-y-3">
            <div>
              <p className="text-gray-400 font-bold">1. Raw Scanner Output</p>
              <p className="mt-1">1944-07_Vance_Family_WWII_Deployment_ORIGINAL.tiff</p>
            </div>
            <div>
              <p className="text-brand-orange font-bold">2. Restored Version (Physical repairs complete)</p>
              <p className="mt-1">1944-07_Vance_Family_WWII_Deployment_RESTORED.tiff</p>
            </div>
            <div>
              <p className="text-blue-600 font-bold">3. Colorized Version (AI color added)</p>
              <p className="mt-1">1944-07_Vance_Family_WWII_Deployment_COLORIZED.jpg</p>
            </div>
          </div>

          <div className="border-l-2 border-brand-orange pl-4 py-2 mt-4">
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              <strong>Why use YYYY-MM or YYYY-MM-DD?</strong> Starting file names with a ISO date format
              forces your computer to sort images chronologically by default. If you only know the year,
              start with <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">YYYY-00-00</code>.
            </p>
          </div>
        </section>

        {/* 5. Cataloging Tools & Preservation */}
        <section id="metadata-tools" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            5. Cataloging Tools &amp; How to Embed Data
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Do not write metadata using notepad. You need digital asset management software that writes
            standardized IPTC and EXIF headers directly into the files. Here are the recommended tools:
          </p>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-gray-800 font-bold">Mylio Photos (Recommended for family archives)</p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                A specialized photo management tool designed for family history. It embeds titles,
                descriptions, keywords, and face tags directly into the image headers.
              </p>
            </div>
            <div>
              <p className="text-gray-800 font-bold">Adobe Bridge (Free, advanced)</p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                A powerful file manager that allows you to batch-edit IPTC metadata for dozens of photos
                simultaneously. Ideal for processing large batches after scanning.
              </p>
            </div>
            <div>
              <p className="text-gray-800 font-bold">ExifTool (Command line, open source)</p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                The gold standard for technical users. It allows you to write scripts to copy metadata
                from raw scans directly to restored files or export metadata lists to spreadsheets.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Metadata Stripping Warning */}
        <section id="stripping-warning" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            6. WARNING: Keep Your Master Files Safe From Messaging Apps
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Once you have spent time scanning, restoring, and cataloging your family photos, be extremely
            careful how you share them.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            <strong>Social media sites (Facebook, Instagram) and messaging apps (WhatsApp, Messenger)
            aggressively strip metadata.</strong> To reduce file sizes and protect user privacy, these
            platforms delete IPTC tags, scanner details, captions, and dates. If a relative downloads
            a photo from WhatsApp, they receive a stripped, compressed copy with all your cataloging
            work deleted.
          </p>

          <div className="border-l-2 border-brand-orange pl-4 py-2 mt-4 text-sm font-medium text-gray-700">
            <p className="font-extrabold text-brand-black text-base">How to share metadata safely:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1.5 leading-relaxed">
              <li>
                Share master files using secure cloud drives (Google Drive, Dropbox, or OneDrive) that
                preserve original files unmodified.
              </li>
              <li>
                Compile restored photos, captions, and family metadata into a permanent{" "}
                <Link
                  href="/family-memory-book"
                  className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                >
                  Family Memory Book
                </Link>{" "}
                that preserves your descriptions in a print or digital layout.
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 pt-10">
          <div className="space-y-4">
            <p className="text-gray-700 font-medium leading-relaxed">
              Ready to restore your family photos and build your archive? Start by cleaning up your scan files with our damage-aware restoration tool.
            </p>
            <Link
              href="/old-photo-restoration"
              className="inline-flex items-center gap-2 bg-brand-black text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange transition-colors shadow-md"
            >
              <span>Restore Photo Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </GuideLayout>
  )
}
