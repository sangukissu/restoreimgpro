// /lib/generate-pages.ts

import { problems, photoTypes, actions, generalFaqs, restorationKeywords, howToKeywords, digitizationKeywords } from './pseo-data';

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
      const metaDescription = `Restore your ${problem.slug} ${photoType.slug} instantly with AI. Professional-quality results in 30 seconds for just $2.49. ${problem.description.split('.')[0]}. Free preview available - upload now!`;
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

      pages.push(pageData);
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
    pages.push(pageData);
  }

  // --- BUILDLER 3: Restoration Keyword Pages ---
  restorationKeywords.forEach(keyword => {
    const standardSeoContent = generateStandardSeoContent(keyword.keyword, `Use our AI-powered tool to ${keyword.keyword.toLowerCase()}. Get high-quality results in seconds.`);

    const pageData: PseoPageData = {
      slug: keyword.slug,
      h1: keyword.keyword,
      metaTitle: `${keyword.keyword} - Restore Photo Online`,
      metaDescription: `Use our AI-powered tool to ${keyword.keyword.toLowerCase()}. Get high-quality results in seconds.`,
      content: {
        problem: `Are you looking to ${keyword.keyword.toLowerCase()}? You\'ve come to the right place. Our online tool uses advanced AI to restore your photos to their former glory. Whether you need to fix scratches, remove blemishes, or colorize black and white photos, we can help.`,
        solution: `Our tool is easy to use. Simply upload your photo, and our AI will automatically detect and repair any damage. You\'ll be amazed at the results.`,
        subject: `Don\'t let your precious memories fade away. ${keyword.keyword} today and see the difference for yourself.`
      },
      faqs: generalFaqs,
      beforeImageUrl: `/faded.webp`,
      afterImageUrl: `/fade-restored.webp`,
      ...standardSeoContent
    };
    pages.push(pageData);
  });

  // --- BUILDLER 4: How-To Keyword Pages ---
  howToKeywords.forEach(keyword => {
    const standardSeoContent = generateStandardSeoContent(keyword.keyword, `Learn ${keyword.keyword.toLowerCase()} with our easy-to-follow guide. Then, use our AI-powered tool to get perfect results.`);

    const pageData: PseoPageData = {
      slug: keyword.slug,
      h1: keyword.keyword,
      metaTitle: `${keyword.keyword} - Restore Photo Online`,
      metaDescription: `Learn ${keyword.keyword.toLowerCase()} with our easy-to-follow guide. Then, use our AI-powered tool to get perfect results.`,
      content: {
        problem: `Do you want to learn ${keyword.keyword.toLowerCase()}? It can be tricky to get right, but we\'re here to help.`,
        solution: `This guide will walk you through the steps to ${keyword.keyword.toLowerCase()}. We\'ll also show you how our AI-powered tool can make the process even easier.`,
        subject: `Whether you\'re a beginner or a pro, you\'ll find this guide helpful. Let\'s get started!`
      },
      faqs: generalFaqs,
      beforeImageUrl: `/torn.webp`,
      afterImageUrl: `/torn-restored.webp`,
      ...standardSeoContent
    };
    pages.push(pageData);
  });

  // --- BUILDLER 5: Digitization Keyword Pages ---
  digitizationKeywords.forEach(keyword => {
    const standardSeoContent = generateStandardSeoContent(keyword.keyword, `Thinking about ${keyword.keyword.toLowerCase()}? We can help. Learn the best ways to digitize your photos and how our tool can improve the quality.`);

    const pageData: PseoPageData = {
      slug: keyword.slug,
      h1: keyword.keyword,
      metaTitle: `${keyword.keyword} - Restore Photo Online`,
      metaDescription: `Thinking about ${keyword.keyword.toLowerCase()}? We can help. Learn the best ways to digitize your photos and how our tool can improve the quality.`,
      content: {
        problem: `Want to ${keyword.keyword.toLowerCase()}? It\'s a great way to preserve your memories, but it can be a daunting task.`,
        solution: `This guide will explain the different methods for digitizing your photos, from using a scanner to your smartphone. We\'ll also show you how our AI-powered tool can enhance your digitized photos.`,
        subject: `Don\'t let your photos gather dust in a shoebox. Digitize them today and enjoy them for years to come.`
      },
      faqs: generalFaqs,
      beforeImageUrl: `/vintage-family-portraits.webp`,
      afterImageUrl: `/vintage-family-portraits-colorized.webp`,

      ...standardSeoContent
    };
    pages.push(pageData);
  });

  return pages;
}

// --- Main exportable list that your app will use ---
export const allPseoPages = generatePseoPages();

// This function now needs to be async to support the page component
export async function getPageDataBySlug(slug: string) {
  return allPseoPages.find((p) => p.slug === slug);
}