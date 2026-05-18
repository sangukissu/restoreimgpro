import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PseoPageData } from '@/lib/generate-pages';

interface RelatedRestorationsProps {
  currentPageSlug: string;
  allPages: PseoPageData[];
}

export function RelatedRestorations({ currentPageSlug, allPages }: RelatedRestorationsProps) {
  // Logic to find related pages. 
  // For simplicity, we filter out the current page, and maybe find pages sharing the same problem or photoType prefix/suffix.
  
  // Example slug: fix-faded-wedding-photo
  const parts = currentPageSlug.split('-');
  const isFix = parts[0] === 'fix';
  let problem = '';
  let type = '';
  if (isFix && parts.length >= 3) {
    problem = parts[1]; // simplified
    type = parts.slice(2).join('-');
  }

  // Get related pages
  const related = allPages
    .filter(p => p.slug !== currentPageSlug)
    .filter(p => {
      // Basic matching
      return p.slug.includes(problem) || p.slug.includes(type);
    })
    .slice(0, 3); // Take top 3

  // Fallback if no specific relation found
  const displayPages = related.length >= 3 ? related : allPages.filter(p => p.slug !== currentPageSlug).slice(0, 3);

  if (!displayPages || displayPages.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
              Related Restorations
            </h2>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {displayPages.map((page) => (
            <Link key={page.slug} href={`/restore/${page.slug}`}>
              <div className="group bg-[#F2F2F0] rounded-[1.5rem] p-6 hover:bg-[#FF4D00]/5 transition-colors border border-transparent hover:border-[#FF4D00]/10 h-full flex flex-col">
                <h3 className="font-bold text-xl text-[#111111] mb-2 group-hover:text-[#FF4D00] transition-colors">
                  {page.h1}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
                  {page.metaDescription}
                </p>
                <div className="mt-6 flex items-center text-[#FF4D00] font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                  Read more <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
