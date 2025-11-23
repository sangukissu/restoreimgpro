// Filename: ComparisonSection.tsx
"use client"

import { CheckCircle, XCircle, Shield, Image as ImageIcon } from "lucide-react"
import React from "react"

// A helper component for consistent icons
const YesIcon = () => <CheckCircle className="w-6 h-6 text-green-500 inline-block" />
const NoIcon = () => <XCircle className="w-6 h-6 text-gray-400 inline-block" />

const comparisonData = [
  {
    feature: "Restoration Quality",
    bringback: "Natural, AI-powered results",
    manual: "High (Artist dependent)",
    freeTools: "Often unnatural or 'plastic'",
    icon: YesIcon,
  },
  {
    feature: "Privacy & Security",
    bringback: "100% Private (Files deleted)",
    manual: "Generally Private",
    freeTools: "Major Concern (Uses your data)",
    icon: YesIcon,
  },
  {
    feature: "Turnaround Time",
    bringback: "Under 30 Seconds",
    manual: "Days or Weeks",
    freeTools: "Fast",
    icon: YesIcon,
  },
  {
    feature: "Cost Per Photo",
    bringback: "Affordable (~$1)",
    manual: "$50 - $200+",
    freeTools: "Free (with compromises)",
    icon: YesIcon,
  },
  {
    feature: "Photo Animation",
    bringback: "Yes, subtle & lifelike",
    manual: "Not possible",
    freeTools: "Rare or very limited",
    icon: YesIcon,
  },
  {
    feature: "High-Resolution Output",
    bringback: "Yes, always",
    manual: "Yes",
    freeTools: "Often limited or watermarked",
    icon: YesIcon,
  },
  {
    feature: "Ease of Use",
    bringback: "Instant & Automatic",
    manual: "Requires consultation",
    freeTools: "Simple upload",
    icon: YesIcon,
  },
]

export default function ComparisonSection() {
  return (
    <section id="comparison" className="px-4 py-20 bg-[#F9F7F5]">
      <div className="max-w-6xl mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl border-6 border-gray-200 shadow-sm p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-2">
              FEATURE COMPARISON
            </p>
            <h2 className=" text-4xl lg:text-5xl text-black leading-tight">
              BringBack AI vs The Alternatives
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We don't just restore photos. We offer a complete, modern solution that is fast, private, and beautifully simple.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full" style={{ minWidth: "700px" }}>
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr>
                    <th className="text-left font-semibold text-gray-800 pb-4">Features</th>
                    <th className="text-left font-semibold text-gray-800 pb-4">
                      <ImageIcon className="inline-block w-5 h-5 mr-2" />BringBack AI
                    </th>
                    <th className="text-left font-semibold text-gray-800 pb-4">Manual Services</th>
                    <th className="text-left font-semibold text-gray-800 pb-4">Free AI Tools</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={`${index % 2 === 0 ? 'bg-gray-50' : ''
                        }`}
                    >
                      <td className="text-left text-gray-700 py-5 px-2">{row.feature}</td>
                      <td className="text-left text-gray-800 py-5 px-2">
                        <div className="flex items-center">
                          <row.icon /> <span className="ml-2 text-xs sm:text-sm">{row.bringback}</span>
                        </div>
                      </td>
                      <td className="text-left text-gray-600 py-5 px-2">
                        <div className="flex items-center">
                          {row.manual === "Not possible" || row.manual === "Requires consultation" ? (
                            <NoIcon />
                          ) : (
                            <YesIcon />
                          )}{" "}
                          <span className="ml-2 text-xs sm:text-sm">{row.manual}</span>
                        </div>
                      </td>
                      <td className="text-left text-gray-600 py-5 px-2">
                        <div className="flex items-center">
                          {row.freeTools.includes("Concern") || row.freeTools.includes("limited") ? (
                            <NoIcon />
                          ) : (
                            <YesIcon />
                          )}{" "}
                          <span className="ml-2 text-xs sm:text-sm">{row.freeTools}</span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Verdict Row - Proper table row */}
                  <tr className="mt-4">
                    <td className="text-left font-bold text-gray-800 py-6 px-2">Verdict</td>
                    <td className="text-left font-bold text-green-700 text-xs sm:text-sm py-6 px-2">
                      Best Overall Value
                    </td>
                    <td className="text-left font-bold text-orange-600 text-xs sm:text-sm py-6 px-2">
                      Highest Quality, Highest Price
                    </td>
                    <td className="text-left font-bold text-red-600 text-xs sm:text-sm py-6 px-2">
                      Compromised Quality & Privacy
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Concluding Paragraph */}
          <div className="text-center mt-16 max-w-3xl mx-auto">
            <p className="text-lg text-gray-600">
              The choice is clear. For a solution that is fast, affordable, private, and delivers professional-quality results with the magic of animation, BringBack AI is the definitive modern choice for preserving your memories.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}