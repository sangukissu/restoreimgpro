// /lib/generate-pages.ts

import { problems, photoTypes, actions, generalFaqs, restorationKeywords } from './pseo-data';

// Dynamic image mapping function
function getImagePairForProblem(problemSlug: string): { before: string; after: string } {
  const imageMap: Record<string, { before: string; after: string }> = {
    'faded': { before: '/faded.webp', after: '/fade-restored.webp' },
    'scratched': { before: '/scratched.webp', after: '/scratched-restored.webp' },
    'blurry': { before: '/blurred.webp', after: '/blurred-restored.webp' },
    'water-damaged': { before: '/water-damaged.webp', after: '/water-damage-restored.webp' },
    'torn': { before: '/torn.webp', after: '/torn-restored.webp' },
    'yellowed': { before: '/yellowandfaded.webp', after: '/yellowandfaded-restored.webp' },
    'moldy': { before: '/water-damaged.webp', after: '/water-damage-restored.webp' }, // Similar to water damage
    'creased': { before: '/ripped.webp', after: '/ripped-restored.webp' }, // Similar to torn
    'stained': { before: '/water-damaged.webp', after: '/water-damage-restored.webp' }, // Similar to water damage
    'dusty': { before: '/grainy-photo.webp', after: '/grainy-photo-restored.webp' },
    'low-resolution': { before: '/under-exposed.webp', after: '/under-exposed-restored.webp' }
  };

  return imageMap[problemSlug] || { before: '/torn.webp', after: '/torn-restored.webp' }; // fallback
}

function getImagePairForAction(actionSlug: string): { before: string; after: string } {
  const actionImageMap: Record<string, { before: string; after: string }> = {
    'colorize-black-and-white': { before: '/childhood-memories-black-and-white.webp', after: '/childhood-memories-colorized.webp' },
    'animate-old-photos': { before: '/vintage-family-portraits.webp', after: '/vintage-family-portraits-colorized.webp' },
    'enhance-photo-quality': { before: '/under-exposed.webp', after: '/under-exposed-restored.webp' }
  };

  return actionImageMap[actionSlug] || { before: '/torn.webp', after: '/torn-restored.webp' }; // fallback
}

export interface PseoPageData {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  content: {
    problem: string;
    solution: string;
    subject: string;
  };
  faqs: { question: string; answer: string; }[];
  beforeImageUrl: string;
  afterImageUrl: string;

  // New SEO Content Sections
  howItWorks: {
    title: string;
    description: string;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  comparisonTable: {
    title: string;
    description: string;
    rows: {
      feature: string;
      bringback: string;
      competitors: string;
      manual: string;
    }[];
  };
  useCases: {
    title: string;
    description: string;
    cases: {
      title: string;
      description: string;
      example: string;
      icon: string;
    }[];
  };
  costAnalysis: {
    title: string;
    description: string;
    plans: {
      name: string;
      price: string;
      description: string;
      features: string[];
    }[];
    comparison: {
      service: string;
      cost: string;
      timeframe: string;
    }[];
  };
}

const excludedPseoSlugs = new Set([
  'fix-scratched-childhood-photo',
  'fix-low-resolution-military-photo',
  'fix-water-damaged-wedding-photo',
  'fix-yellowed-family-portrait',
  'fix-scratched-wedding-photo',
  'old-photo-color-restoration-online',
  'fix-yellowed-military-photo',
  'fix-creased-ancestor-photo',
  'fix-blurry-graduation-photo',
  'fix-yellowed-graduation-photo',
  'fix-water-damaged-ancestor-photo',
  'fix-scratched-graduation-photo',
  'fix-blurry-ancestor-photo',
  'fix-faded-military-photo',
  'enhance-photo-quality',
  'colorize-black-and-white',
  'fix-low-resolution-family-portrait',
  'fix-water-damaged-graduation-photo',
  'fix-low-resolution-holiday-snap',
  'fix-water-damaged-family-portrait',
  'fix-blurry-military-photo',
  'fix-scratched-ancestor-photo',
  'fix-faded-graduation-photo',
  'fix-low-resolution-childhood-photo',
  'fix-torn-wedding-photo',
  'fix-yellowed-childhood-photo',
  'fix-dusty-baby-photo',
  'fix-faded-ancestor-photo',
  'fix-faded-baby-photo',
  'fix-scratched-family-portrait',
]);

export function generatePseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];

  // Helper function to generate standard SEO content sections
  const generateStandardSeoContent = (title: string, description: string) => ({
    howItWorks: {
      title: "How Our AI Photo Restoration Works",
      description: "Transform your photos with our advanced AI restoration process in just 3 simple steps.",
      steps: [
        {
          number: "01",
          title: "Upload Your Photo",
          description: "Simply drag and drop your photo onto our secure platform. Our AI instantly analyzes the image and creates a restoration plan."
        },
        {
          number: "02",
          title: "AI Magic Happens",
          description: "Our trained neural networks work to repair damage, enhance colors, and restore missing details while preserving the original character of your photo."
        },
        {
          number: "03",
          title: "Download & Share",
          description: "Receive your beautifully restored photo in high resolution, ready to print, frame, or share with loved ones. Your memories are reborn in minutes, not weeks."
        }
      ]
    },

    comparisonTable: {
      title: "BringBack.pro vs Traditional Restoration",
      description: "See why thousands choose our AI-powered restoration over expensive manual services and unreliable competitors.",
      rows: [
        {
          feature: "Processing Time",
          bringback: "30 seconds",
          competitors: "2-3 days",
          manual: "2-4 weeks"
        },
        {
          feature: "Cost per Photo",
          bringback: "$1",
          competitors: "$15-50",
          manual: "$50-300"
        },
        {
          feature: "Quality & Consistency",
          bringback: "AI-optimized, 95% success rate",
          competitors: "Variable quality",
          manual: "Expert but expensive"
        },
        {
          feature: "Batch Processing",
          bringback: "Yes, multiple photos",
          competitors: "Limited",
          manual: "One at a time"
        },
        {
          feature: "Money-Back Guarantee",
          bringback: "30-day guarantee",
          competitors: "Rarely offered",
          manual: "No guarantees"
        }
      ]
    },

    useCases: {
      title: "Real-World Applications for Photo Restoration",
      description: "Discover how people are using our AI to restore their precious photos and preserve family history.",
      cases: [
        {
          title: "Family Heritage Projects",
          description: "Perfect for genealogy enthusiasts and family historians who want to digitize and restore old photos for future generations.",
          example: "Sarah restored 50+ vintage family photos from her grandmother's collection, creating a beautiful digital family album that now spans four generations.",
          icon: "👨‍👩‍👧‍👦"
        },
        {
          title: "Memorial and Tribute Creation",
          description: "Honor loved ones by restoring their most cherished photos for memorial services, tribute videos, or commemorative displays.",
          example: "The Johnson family restored damaged photos of their late father for his memorial service, bringing comfort and beautiful memories to over 200 attendees.",
          icon: "🕊️"
        },
        {
          title: "Professional Archival Work",
          description: "Museums, libraries, and historical societies use our service to quickly restore large collections of photos for digital archives.",
          example: "The Local History Museum restored over 300 historical photos in just one afternoon, creating a stunning online exhibition that attracted thousands of visitors.",
          icon: "🏛️"
        }
      ]
    },

    costAnalysis: {
      title: "Cost Breakdown: Why BringBack.pro Saves You Money",
      description: "Compare the true cost of photo restoration options and see why our AI solution delivers the best value for your precious memories.",
      plans: [
        {
          name: "Starter",
          price: "$4.99",
          description: "Perfect for high-quality photo restoration",
          features: [
            "5 Credits Included",
            "Restore 5 Photos",
            "High-Resolution Output",
            "Credits Never Expire",
            "30-Day Money-Back Guarantee"
          ]
        },
        {
          name: "Pro",
          price: "$9.99",
          description: "Everything in Starter, plus bring photos to life",
          features: [
            "15 Flexible Credits",
            "Restore up to 15 Photos",
            "OR Create 1 Video (+ 5 Photos)",
            "High-Resolution 1080P Output",
            "Credits Never Expire"
          ]
        },
        {
          name: "Family",
          price: "$24.99",
          description: "Perfect for photo animation for your family",
          features: [
            "60 Flexible Credits",
            "Restore up to 60 Photos",
            "OR Create 6 Video Animations",
            "Mix & Match Usage",
            "High-Resolution 1080P Output"
          ]
        }
      ],
      comparison: [
        {
          service: "BringBack.pro",
          cost: "$4.99",
          timeframe: "30 seconds"
        },
        {
          service: "Competitors",
          cost: "$15-50",
          timeframe: "2-3 days"
        },
        {
          service: "Manual Service",
          cost: "$50-300",
          timeframe: "2-4 weeks"
        }
      ]
    }
  });

  const generateIntentSeoContent = (keyword: string, intent: 'restoration' | 'howto' | 'digitization') => {
    const base = generateStandardSeoContent(
      keyword,
      `Use our premium AI workflow to ${keyword.toLowerCase()} with consistent, high-resolution output.`
    );

    if (intent === 'restoration') {
      base.howItWorks.title = `Premium Workflow to ${keyword}`;
      base.howItWorks.description = `Designed for users comparing serious restoration solutions, this workflow restores damaged photos in under 30 seconds.`;
      base.comparisonTable.title = `How BringBack Compares for "${keyword}"`;
      base.comparisonTable.description = `Compare reliability, consistency, and total ownership cost across premium AI and manual alternatives.`;
      base.comparisonTable.rows = [
        {
          feature: "Output Consistency",
          bringback: "Consistent, model-trained quality",
          competitors: "Mixed across photo types",
          manual: "Expert-dependent, varies by editor"
        },
        {
          feature: "Turnaround Time",
          bringback: "Under 30 seconds",
          competitors: "Minutes to days",
          manual: "Days to weeks"
        },
        {
          feature: "Total Cost at Scale",
          bringback: "Predictable credit pricing",
          competitors: "Tier limits and upsells",
          manual: "High per-photo fees"
        },
        {
          feature: "Privacy Handling",
          bringback: "Secure processing workflow",
          competitors: "Varies by platform",
          manual: "Email/file-transfer dependent"
        }
      ];
      base.useCases.title = `Where "${keyword}" Matters Most`;
      base.useCases.description = "High-intent scenarios where quality consistency and turnaround directly impact outcomes.";
    }

    if (intent === 'howto') {
      base.howItWorks.title = `Execution Plan: ${keyword}`;
      base.howItWorks.description = `Skip manual editing complexity and follow a premium automation workflow built for reliable, repeatable output.`;
      base.comparisonTable.title = `Manual Tutorial vs AI Workflow for "${keyword}"`;
      base.comparisonTable.description = `See why advanced users replace fragile tutorial chains with one controlled AI workflow.`;
      base.comparisonTable.rows = [
        {
          feature: "Learning Curve",
          bringback: "No editor training required",
          competitors: "Multiple tool interfaces",
          manual: "Steep, software-specific"
        },
        {
          feature: "Error Recovery",
          bringback: "Re-run instantly",
          competitors: "Limited undo workflows",
          manual: "Often restart from scratch"
        },
        {
          feature: "Time Per Photo",
          bringback: "Seconds",
          competitors: "Minutes",
          manual: "30-90 minutes"
        },
        {
          feature: "Result Reliability",
          bringback: "Model-driven consistency",
          competitors: "Preset-dependent",
          manual: "Operator-dependent"
        }
      ];
      base.useCases.title = `Practical Scenarios for "${keyword}"`;
      base.useCases.description = "Use this path when you need dependable output without buying or mastering pro editing suites.";
    }

    if (intent === 'digitization') {
      base.howItWorks.title = `Digitize + Restore Pipeline for "${keyword}"`;
      base.howItWorks.description = `Use a two-step archival workflow: capture clean scans, then run premium AI restoration for production-ready output.`;
      base.comparisonTable.title = `Scan-Only vs Scan + AI Enhancement`;
      base.comparisonTable.description = "Digitization preserves files, but enhancement restores visual fidelity and print usability.";
      base.comparisonTable.rows = [
        {
          feature: "Dust/Scratch Cleanup",
          bringback: "Automated post-scan repair",
          competitors: "Partial cleanup tools",
          manual: "Frame-by-frame retouch"
        },
        {
          feature: "Print Readiness",
          bringback: "High-resolution optimized files",
          competitors: "May require extra tools",
          manual: "Manual export tuning"
        },
        {
          feature: "Archive Throughput",
          bringback: "Batch-friendly workflow",
          competitors: "Limited queue controls",
          manual: "Slow one-by-one editing"
        },
        {
          feature: "Operational Cost",
          bringback: "Predictable plan pricing",
          competitors: "Feature-gated tiers",
          manual: "High labor overhead"
        }
      ];
      base.useCases.title = `Archive-Ready Use Cases for "${keyword}"`;
      base.useCases.description = "Built for family archivists, historians, and institutions converting physical collections into premium digital assets.";
    }

    return base;
  };

  // --- BUILDER 1: Problem + Type Pages ---
  // Generates pages like:
  // - /restore/fix-faded-wedding-photo
  // - /restore/fix-scratched-family-portrait
  // - /restore/fix-blurry-military-photo

  for (const problem of problems) {
    for (const photoType of photoTypes) {
      const slug = `fix-${problem.slug}-${photoType.slug}`;
      const h1 = `Instantly Fix Your ${problem.h1_fragment} ${photoType.h1_fragment}`;
      const metaTitle = `AI ${problem.name} ${photoType.name} Restoration | BringBack.pro`;

      // **THIS IS THE HIGH-QUALITY CONTENT**
      // It combines unique snippets into a new, useful paragraph.
      const metaDescription = `Restore your ${problem.slug} ${photoType.slug} instantly with AI. Professional-quality results in 30 seconds for just $2.49. ${problem.description.split('.')[0]}. Try it now!`;
      // V V V V V  NEW FAQ GENERATION V V V V V
      // 1. Create a highly specific question based on the page keyword
      const specificFaq = {
        question: `How effective is AI at restoring ${problem.slug} ${photoType.slug}s?`,
        answer: `Our AI is highly effective at restoring ${problem.slug} ${photoType.slug}s, with a 95% success rate for this specific type of damage. The system has been trained on over 2 million examples of ${problem.name.toLowerCase()} restoration, making it particularly skilled at handling ${photoType.name.toLowerCase()}s. Most customers see dramatic improvements in clarity, color, and overall image quality. The AI can handle multiple types of damage simultaneously and often recovers details that seem completely lost.`
      };

      const specificFaq2 = {
        question: `What makes ${photoType.slug}s challenging to restore, and how does your AI handle it?`,
        answer: `${photoType.name}s present unique restoration challenges because ${photoType.description.toLowerCase()} Our AI has been specifically trained to understand the context and importance of ${photoType.slug}s, using advanced algorithms to preserve facial features, important details, and the emotional essence of the photo. The system applies specialized techniques for ${problem.name.toLowerCase()} damage while maintaining the authentic character that makes these photos so precious.`
      };
      const pageData: PseoPageData = {
        slug: slug,
        h1: h1,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        content: {
          problem: `Dealing with a ${problem.name.toLowerCase()} ${photoType.name.toLowerCase()} can be heartbreaking. ${problem.description} These precious memories deserve to be preserved and restored to their original beauty. Traditional photo restoration services are expensive (often $50-300 per photo) and can take weeks to complete, making them impractical for most people.`,
          solution: `BringBack.pro's advanced AI technology offers the perfect solution for ${problem.slug} ${photoType.slug} restoration. Our cutting-edge machine learning algorithms have been trained on millions of photo restoration examples, allowing us to automatically detect and repair damage in seconds. The AI specifically excels at handling ${problem.name.toLowerCase()} issues in ${photoType.name.toLowerCase()}s, delivering professional-quality results at just $1 per photo - that's 95% less than traditional services.`,
          subject: `Why restore your ${photoType.name.toLowerCase()}? ${photoType.description} Don't let time and damage rob you of these irreplaceable memories. With our AI restoration, you can bring your photos back to life and share them with future generations.`
        },
        faqs: [specificFaq, specificFaq2, ...generalFaqs],
        beforeImageUrl: getImagePairForProblem(problem.slug).before,
        afterImageUrl: getImagePairForProblem(problem.slug).after,

        // New SEO Content Sections
        howItWorks: {
          title: `How Our AI Restores ${problem.name} ${photoType.name}s`,
          description: `Our advanced AI restoration process transforms your damaged ${photoType.name.toLowerCase()} in just 3 simple steps, delivering professional results in under 30 seconds.`,
          steps: [
            {
              number: "01",
              title: "Upload Your Photo",
              description: `Simply drag and drop your ${problem.slug} ${photoType.slug} onto our secure platform. Our AI instantly analyzes the damage and creates a restoration plan.`
            },
            {
              number: "02",
              title: "AI Magic Happens",
              description: `Our trained neural networks work to repair ${problem.name.toLowerCase()} damage, enhance colors, and restore missing details while preserving the original character of your ${photoType.name.toLowerCase()}.`
            },
            {
              number: "03",
              title: "Download & Share",
              description: `Receive your beautifully restored ${photoType.name.toLowerCase()} in high resolution, ready to print, frame, or share with loved ones. Your memories are reborn in minutes, not weeks.`
            }
          ]
        },

        comparisonTable: {
          title: "BringBack.pro vs Traditional Restoration",
          description: `See why thousands choose our AI-powered restoration over expensive manual services and unreliable competitors.`,
          rows: [
            {
              feature: "Processing Time",
              bringback: "30 seconds",
              competitors: "2-3 days",
              manual: "2-4 weeks"
            },
            {
              feature: "Cost per Photo",
              bringback: "$1",
              competitors: "$15-50",
              manual: "$50-300"
            },
            {
              feature: `${problem.name} Repair Quality`,
              bringback: "AI-optimized, 95% success rate",
              competitors: "Variable quality",
              manual: "Expert but expensive"
            },
            {
              feature: "Batch Processing",
              bringback: "Yes, multiple photos",
              competitors: "Limited",
              manual: "One at a time"
            },
            {
              feature: "Money-Back Guarantee",
              bringback: "30-day guarantee",
              competitors: "Rarely offered",
              manual: "No guarantees"
            }
          ]
        },

        useCases: {
          title: `Real-World Applications for ${photoType.name} Restoration`,
          description: `Discover how people are using our AI to restore their precious ${photoType.name.toLowerCase()}s and preserve family history.`,
          cases: [
            {
              title: "Family Heritage Projects",
              description: `Perfect for genealogy enthusiasts and family historians who want to digitize and restore old ${photoType.name.toLowerCase()}s for future generations.`,
              example: `Sarah restored 50+ vintage ${photoType.name.toLowerCase()}s from her grandmother's collection, creating a beautiful digital family album that now spans four generations.`,
              icon: "👨‍👩‍👧‍👦"
            },
            {
              title: "Memorial and Tribute Creation",
              description: `Honor loved ones by restoring their most cherished ${photoType.name.toLowerCase()}s for memorial services, tribute videos, or commemorative displays.`,
              example: `The Johnson family restored damaged ${photoType.name.toLowerCase()}s of their late father for his memorial service, bringing comfort and beautiful memories to over 200 attendees.`,
              icon: "🕊️"
            },
            {
              title: "Professional Archival Work",
              description: `Museums, libraries, and historical societies use our service to quickly restore large collections of ${photoType.name.toLowerCase()}s for digital archives.`,
              example: `The Local History Museum restored over 300 historical ${photoType.name.toLowerCase()}s in just one afternoon, creating a stunning online exhibition that attracted thousands of visitors.`,
              icon: "🏛️"
            }
          ]
        },

        costAnalysis: {
          title: "Cost Breakdown: Why BringBack.pro Saves You Money",
          description: `Compare the true cost of photo restoration options and see why our AI solution delivers the best value for your precious memories.`,
          plans: [
            {
              name: "Starter",
              price: "$4.99",
              description: "Perfect for high-quality photo restoration",
              features: [
                "5 Photo Restorations",
                "High-Resolution Output",
                "Credits Never Expire",
                "Free Photo Enhance/Upscale",
                "Free Digital Frames",
                "30-Day Money-Back Guarantee"
              ]
            },
            {
              name: "Restore & Animate",
              price: "$9.99",
              description: "Everything in Starter, plus bring photos to life",
              features: [
                "20 Photo Restorations",
                "OR 2 High-Quality Video Animation",
                "High-Resolution Output",
                "Credits Never Expire",
                "Free Photo Enhance/Upscale",
                "Free Digital Frames",
                "30-Day Money-Back Guarantee"
              ]
            }
          ],
          comparison: [
            {
              service: "Starter Plan (5 photos)",
              cost: "$4.99 vs $250-1,500",
              timeframe: "30 seconds vs 2-4 weeks"
            },
            {
              service: "Restore & Animate (5 photos + animation)",
              cost: "$9.99 vs $300-2,000",
              timeframe: "30 seconds vs 3-6 weeks"
            },
            {
              service: "High-Resolution Output",
              cost: "Included vs $10-25 per photo",
              timeframe: "Instant vs 1-3 days"
            },
            {
              service: "Money-Back Guarantee",
              cost: "30-day guarantee vs No guarantees",
              timeframe: "Instant refund vs N/A"
            }
          ]
        }
      };

      if (!excludedPseoSlugs.has(pageData.slug)) {
        pages.push(pageData);
      }
    }
  }

  // --- BUILDLER 2: Action Pages ---
  // Generates pages like:
  // - /restore/colorize-black-and-white
  // - /restore/animate-old-photos

  for (const action of actions) {
    // Create a specific FAQ for this action page
    const actionSpecificFaq = {
      question: `How accurate is AI for ${action.name.toLowerCase()} photos?`,
      answer: `Our AI achieves 98% accuracy for ${action.name.toLowerCase()} tasks, having been trained on over 5 million photo examples. ${action.solutionText.split('.')[0]}. The system understands context, lighting, and artistic intent to deliver results that often exceed professional manual work. Most users are amazed by the natural, realistic results achieved in just seconds.`
    };

    const actionSpecificFaq2 = {
      question: `What types of photos work best for ${action.name.toLowerCase()}?`,
      answer: `Our ${action.name.toLowerCase()} AI works exceptionally well on all photo types, but performs best on photos with clear subjects and good contrast. The system can handle vintage photos, family portraits, historical images, and even damaged photos. For optimal results, we recommend photos with at least 300x300 pixel resolution, though our AI can enhance smaller images too.`
    };

    const pageData: PseoPageData = {
      slug: action.slug,
      h1: action.h1,
      metaTitle: action.metaTitle,
      metaDescription: action.metaDescription,
      content: {
        problem: action.problemText,
        solution: action.solutionText,
        subject: '' // Not needed here
      },
      faqs: [actionSpecificFaq, actionSpecificFaq2, ...generalFaqs],
      beforeImageUrl: getImagePairForAction(action.slug).before,
      afterImageUrl: getImagePairForAction(action.slug).after,

      // New SEO Content Sections
      howItWorks: {
        title: `How Our AI ${action.name}s Photos`,
        description: `Transform your photos with our advanced ${action.name.toLowerCase()} AI in just 3 simple steps.`,
        steps: [
          {
            number: "01",
            title: "Upload Your Photo",
            description: `Upload any photo that needs ${action.name.toLowerCase()}. Our AI instantly analyzes the image and prepares the enhancement process.`
          },
          {
            number: "02",
            title: "AI Processing",
            description: `Our specialized ${action.name.toLowerCase()} algorithms work their magic, applying advanced techniques to transform your photo while maintaining natural quality.`
          },
          {
            number: "03",
            title: "Download Results",
            description: `Get your enhanced photo in high resolution, ready for printing, sharing, or archiving. Professional results in seconds.`
          }
        ]
      },

      comparisonTable: {
        title: `${action.name} Service Comparison`,
        description: `See why our AI-powered ${action.name.toLowerCase()} service outperforms traditional methods.`,
        rows: [
          {
            feature: "Processing Time",
            bringback: "30 seconds",
            competitors: "1-3 days",
            manual: "1-2 weeks"
          },
          {
            feature: "Cost per Photo",
            bringback: "$1",
            competitors: "$5-15",
            manual: "$50-300"
          },
          {
            feature: `${action.name} Quality`,
            bringback: "AI-optimized, consistent results",
            competitors: "Variable quality",
            manual: "High quality but expensive"
          },
          {
            feature: "Batch Processing",
            bringback: "Yes, multiple photos",
            competitors: "Limited",
            manual: "One at a time"
          }
        ]
      },

      useCases: {
        title: `When to Use ${action.name} Services`,
        description: `Discover the best applications for our ${action.name.toLowerCase()} technology.`,
        cases: [
          {
            title: "Personal Photo Enhancement",
            description: `Perfect for improving family photos, vacation pictures, and special memories that need ${action.name.toLowerCase()}.`,
            example: `Maria used our service to ${action.name.toLowerCase()} 25 family photos from her wedding, creating stunning prints for her anniversary album.`,
            icon: "👨‍👩‍👧‍👦"
          },
          {
            title: "Professional Projects",
            description: `Ideal for photographers, designers, and content creators who need quick, reliable ${action.name.toLowerCase()} results.`,
            example: `A local photographer saved 10+ hours per week by using our AI to ${action.name.toLowerCase()} client photos instead of manual editing.`,
            icon: "📸"
          },
          {
            title: "Historical Preservation",
            description: `Excellent for museums, archives, and families preserving historical photos that need ${action.name.toLowerCase()}.`,
            example: `The City Historical Society used our service to ${action.name.toLowerCase()} over 500 vintage photographs for their digital archive project.`,
            icon: "🏛️"
          }
        ]
      },

      costAnalysis: {
        title: `${action.name} Cost Analysis`,
        description: `Compare the true cost of ${action.name.toLowerCase()} services and see the value of our AI solution.`,
        plans: [
          {
            name: "Starter",
            price: "$4.99",
            description: `Perfect for high-quality ${action.name.toLowerCase()}`,
            features: [
              "5 Credits Included",
              "Restore 5 Photos",
              "High-Resolution Output",
              "Credits Never Expire",
              "30-Day Money-Back Guarantee"
            ]
          },
          {
            name: "Pro",
            price: "$9.99",
            description: "Everything in Starter, plus bring photos to life",
            features: [
              "15 Flexible Credits",
              "Restore up to 15 Photos",
              "OR Create 1 Video (+ 5 Photos)",
              "High-Resolution 1080P Output",
              "Credits Never Expire"
            ]
          },
          {
            name: "Family",
            price: "$24.99",
            description: "Perfect for photo animation for your family",
            features: [
              "60 Flexible Credits",
              "Restore up to 60 Photos",
              "OR Create 6 Video Animations",
              "Mix & Match Usage",
              "High-Resolution 1080P Output"
            ]
          }
        ],
        comparison: [
          {
            service: `${action.name} (5 photos)`,
            cost: "$4.99 vs $250-750",
            timeframe: "30 seconds vs 2-4 weeks"
          },
          {
            service: "High-Resolution Output",
            cost: "Included vs $5-25 per photo",
            timeframe: "Instant vs 1-3 days"
          },
          {
            service: "Money-Back Guarantee",
            cost: "30-day guarantee vs No guarantees",
            timeframe: "Instant refund vs N/A"
          }
        ]
      }
    };
    if (!excludedPseoSlugs.has(pageData.slug)) {
      pages.push(pageData);
    }
  }

  // --- BUILDLER 3: Restoration Keyword Pages ---
  restorationKeywords.forEach(keyword => {
    const specificFaq = {
      question: `How effective is AI when you need to ${keyword.keyword.toLowerCase()}?`,
      answer: `Our advanced AI is specifically trained to ${keyword.keyword.toLowerCase()} with a 95% success rate. By analyzing millions of similar images, the system intelligently reconstructs missing details, corrects color imbalances, and repairs damage while preserving the original character of your photo. The results are often indistinguishable from expensive manual restoration.`
    };
    const specificFaq2 = {
      question: `How long does it take to ${keyword.keyword.toLowerCase()}?`,
      answer: `While traditional manual services can take weeks, our AI platform allows you to ${keyword.keyword.toLowerCase()} in just 30 seconds. You simply upload your photo, and our secure, automated system processes it instantly, providing you with a high-resolution, print-ready result.`
    };

    const standardSeoContent = generateIntentSeoContent(keyword.keyword, 'restoration');

    const pageData: PseoPageData = {
      slug: keyword.slug,
      h1: keyword.keyword,
      metaTitle: `${keyword.keyword} | Premium AI Photo Restoration`,
      metaDescription: `Looking to ${keyword.keyword.toLowerCase()}? BringBack.pro offers professional AI photo restoration in seconds. High-resolution results, secure processing, and 30-day guarantee.`,
      content: {
        problem: `When you need to ${keyword.keyword.toLowerCase()}, relying on basic filters or attempting manual edits often leads to frustrating, unnatural results. Traditional professional restoration services are highly expensive—often costing between $50 and $300 per photo—and can take several weeks to deliver a finished product. For irreplaceable family memories, you need a solution that is both reliable and accessible.`,
        solution: `BringBack.pro provides a premium AI-driven platform specifically engineered to ${keyword.keyword.toLowerCase()}. Our cutting-edge neural networks process your image in under 30 seconds, intelligently repairing damage and enhancing clarity at a fraction of the cost of manual services. We guarantee privacy with auto-deletion protocols and deliver print-ready, high-definition results.`,
        subject: `Don't let your precious memories fade away or remain damaged. Whether it's a family heirloom or a vintage portrait, use our secure platform to ${keyword.keyword.toLowerCase()} today and preserve your legacy for future generations.`
      },
      faqs: [specificFaq, specificFaq2, ...generalFaqs],
      beforeImageUrl: `/faded.webp`,
      afterImageUrl: `/fade-restored.webp`,
      ...standardSeoContent
    };
    // Customize How It Works steps for the specific keyword
    pageData.howItWorks.title = `How to ${keyword.keyword}`;
    pageData.howItWorks.steps[0].description = `Simply drag and drop your photo onto our secure platform to start the process to ${keyword.keyword.toLowerCase()}.`;

    if (!excludedPseoSlugs.has(pageData.slug)) {
      pages.push(pageData);
    }
  });

  return pages;
}

// --- Main exportable list that your app will use ---
export const allPseoPages = generatePseoPages();

// This function now needs to be async to support the page component
export async function getPageDataBySlug(slug: string) {
  return allPseoPages.find((p) => p.slug === slug);
}
