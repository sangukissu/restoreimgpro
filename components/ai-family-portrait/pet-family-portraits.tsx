import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const PET_PORTRAIT_GUIDANCE = [
  {
    title: "Show the details that make your pet recognizable.",
    description:
      "Choose a clear photo where the eyes, ears, muzzle, and distinctive coat markings are visible. Crop out empty background, but keep enough of the body to show the pet's size and shape.",
  },
  {
    title: "Tell the generator exactly how many pets belong in the group.",
    description:
      "People and pets have separate count controls. You can include up to five pets, which gives the model a clear target when it arranges the finished portrait.",
  },
  {
    title: "Leave enough canvas space for a mixed group.",
    description:
      "For several relatives and animals, a 4:3 or 16:9 canvas gives each subject more room. Place the clearest references first and avoid photos where a pet is tiny or partly hidden.",
  },
]

export function PetFamilyPortraits() {
  return (
    <section id="family-portraits-with-pets" className="w-full bg-brand-bg px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-col gap-7 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
              <span className="text-brand-orange">//</span> Family &amp; Pets{" "}
              <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] font-[850] leading-[1.03] tracking-tighter text-brand-black sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem]">
              Create one family portrait
              <br />
              <span className="text-gray-400">with the pets you love.</span>
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
            Bring dogs, cats, and other companion animals into the same newly composed portrait
            as relatives photographed at a different time or place.
          </p>
        </div>

        <div className="rounded-[1.8rem] bg-brand-surface p-2 sm:rounded-[2.5rem] sm:p-3">
          <div className="grid overflow-hidden rounded-[1.5rem] bg-white lg:grid-cols-[1.08fr_0.92fr]">
            <figure className="flex min-h-full flex-col bg-[#E7DED1]">
              <Image
                src="/family-portrait-with-pets.webp"
                alt="Four family members with a golden retriever and tabby cat in one family portrait"
                width={1448}
                height={1086}
                sizes="(max-width: 1023px) 100vw, 54vw"
                className="h-full min-h-[300px] w-full flex-1 object-cover sm:min-h-[420px]"
              />
              <figcaption className="bg-white px-5 py-3 text-sm font-medium text-gray-500 sm:px-7">
                Example composition: four people, one dog, and one cat in a shared studio portrait.
              </figcaption>
            </figure>

            <div className="p-6 sm:p-9 lg:p-10 xl:p-12">
              <h3 className="text-2xl font-extrabold tracking-tight text-brand-black sm:text-3xl">
                Prepare clear pet references
              </h3>
              <p className="mt-4 text-base font-medium leading-relaxed text-gray-600">
                Upload relatives and pets from separate photos, then set the people and pet counts
                independently. BringBack accepts up to eight reference photos and supports up to
                five pets in one portrait.
              </p>

              <ol className="mt-7 border-y border-gray-200">
                {PET_PORTRAIT_GUIDANCE.map((item, index) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[2rem_1fr] gap-3 border-b border-gray-200 py-5 last:border-b-0"
                  >
                    <span className="pt-0.5 text-sm font-extrabold text-brand-orange">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-extrabold leading-snug text-brand-black">{item.title}</h4>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 border-l-2 border-brand-orange pl-4 text-sm font-medium leading-relaxed text-gray-600">
                AI may reinterpret coat markings, eye color, body size, collars, or paws. Compare
                the finished portrait with every source photo before printing or sharing it.
              </p>

              <Link
                href="/dashboard/family-portrait"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-black px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-orange"
              >
                Create a family portrait with pets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
