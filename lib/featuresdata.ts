
import { FEATURE_CREDIT_COSTS } from "@/lib/pricing";
import { DASHBOARD_CTA, PRIVACY_COPY } from "@/lib/site-copy";

export interface FeaturePageData {
  slug: string;
  parentBreadcrumb?: {
    name: string;
    href: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    h1: string;
    heading: {
      primary: string;
      secondary: string;
    };
    subheadline: string;
    ctaText: string;
    ctaHref?: string;
    trustBadge: string;
    trustHighlights?: string[];
    images?: {
      inputs: string[];
      output: string;
    };
  };
  qualityAnalysis?: {
    heading: string;
    subheading: string;
    features: {
      title: string;
      description: string;
    }[];
    visuals: {
      title?: string;
      inputs: {
        src: string;
        label: string;
        sublabel?: string;
        badge?: string;
        aspectRatio?: "4/3" | "3/4" | "1/1" | "16/9";
      }[];
      output: {
        src: string;
        label: string;
        sublabel?: string;
        badge?: string;
        aspectRatio?: "4/3" | "3/4" | "1/1" | "16/9";
        tags?: string[];
      };
    };
  };
  scenarios?: {
    heading: string;
    subheading: string;
    items: {
      title: string;
      description: string;
      tag?: string;
      tips: string;
    }[];
  };
  photoGuide?: {
    heading: string;
    subheading: string;
    dos: { title: string; desc: string }[];
    donts: { title: string; desc: string }[];
  };
  ethicsNotice?: {
    heading: string;
    subheading: string;
    points: { title: string; description: string }[];
  };
  comparisonMatrix?: {
    heading: string;
    subheading: string;
    options: {
      name: string;
      badge?: string;
      isCurrent?: boolean;
      bestFor: string;
      inputsNeeded: string;
      cost: string;
      href?: string;
    }[];
  };
  showcaseCaptions: {
    beforeLabel: string;
    afterLabel: string;
    caption: string;
  }[];
  howItWorks: {
    heading: string;
    subheading: string;
    steps: {
      step: number;
      title: string;
      description: string;
    }[];
  };
  benefits: {
    heading: string;
    subheading: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  faq: {
    question: string;
    answer: string;
  }[];
}

export const featuresData: Record<string, FeaturePageData> = {

  "add-deceased-loved-one-to-photo": {
    slug: "/features/add-deceased-loved-one-to-photo",
    parentBreadcrumb: {
      name: "Add Person to Photo",
      href: "/add-person-to-photo",
    },
    meta: {
      title: "Add a Deceased Loved One to a Photo with AI",
      description: "Add one deceased loved one to an existing family, wedding, or group photo. Upload the original scene and one clear solo reference; BringBack matches placement, scale, lighting, and shadows.",
      keywords: [
        "add deceased loved one to photo",
        "add deceased loved one to wedding photo",
        "add passed family member to portrait",
        "add late parent to photo",
        "insert deceased relative in family picture",
        "add loved one who passed away to photo",
        "memorial family photo addition"
      ],
    },
    hero: {
      h1: "Add a Deceased Loved One to a Family Photo",
      heading: {
        primary: "Respectfully add a deceased loved one",
        secondary: "to an existing family photo"
      },
      subheadline: "Honor their memory by bringing them into a cherished moment. Upload your existing family or wedding photo and one clear solo reference portrait—our AI carefully harmonizes lighting, scale, perspective, and shadows.",
      ctaText: "Add Loved One to Photo",
      ctaHref: DASHBOARD_CTA.addPerson,
      trustBadge: "Memorial Keepsakes",
      trustHighlights: [
        "2 credits per portrait run",
        "No recurring subscription required",
        "Private account storage",
        "Zero general model training"
      ]
    },
    qualityAnalysis: {
      heading: "Realistic Memorial Harmonization, Not a Cut-and-Paste Sticker",
      subheading: "Seamlessly adding a late family member to an existing scene requires spatial calculation. Rather than a flat cutout, BringBack analyzes room geometry, ambient light, eye-lines, and contact shadows so they look naturally present.",
      features: [
        {
          title: "Directional Relighting & Ambient Warmth",
          description: "Analyzes primary light direction (windows, lamps, outdoor sun) in your base scene and relights your loved one's face and clothing to match identical color temperature and shadow falloff."
        },
        {
          title: "Proportional Scale & Eye-Line Depth",
          description: "Measures 3D spatial depth of the room and surrounding relatives. Sizes and angles the person so they sit or stand at true physical scale rather than appearing oversized or floating."
        },
        {
          title: "Natural Contact Shadows & Grounding",
          description: "Generates realistic contact shadows beneath seating, onto sofa fabric, or across adjoining shoulders and floors, firmly rooting them in the physical environment."
        },
        {
          title: "Strict Facial Likeness Preservation",
          description: "Protects natural facial geometry, bone structure, and characteristic smile from synthetic hallucination, ensuring immediate, emotional recognition by family members."
        }
      ],
      visuals: {
        title: "Memorial Scene Harmonization",
        inputs: [
          {
            src: "/base-family-photo.webp",
            label: "Base Family Photo",
            aspectRatio: "4/3"
          },
          {
            src: "/girl-portrait-reference.webp",
            label: "Solo Portrait",
            aspectRatio: "3/4"
          }
        ],
        output: {
          src: "/harmonized-family-portrait.webp",
          label: "Harmonized Family Portrait",
          aspectRatio: "4/3"
        }
      }
    },
    photoGuide: {
      heading: "Source Photo Guidelines: Getting the Best Memorial Result",
      subheading: "AI harmonization relies directly on the visual quality of your inputs. Following these photo selection principles prevents awkward results and delivers a natural portrait.",
      dos: [
        {
          title: "Upload a clear, front-facing reference photo",
          desc: "Photos where eyes, facial structure, and smile are crisp and unobstructed yield the strongest, most authentic likeness."
        },
        {
          title: "Match posture and eye level where possible",
          desc: "If the base scene shows people sitting on a sofa, a seated or mid-torso reference photo integrates far more naturally than a standing full-body shot."
        },
        {
          title: "Restore damaged or faded photos first",
          desc: "If your only photo of your loved one is torn, faded, or in vintage black & white, run it through our Old Photo Restoration tool first before inserting it into a modern color photo."
        },
        {
          title: "Provide natural room in the base scene",
          desc: "Choose an existing group photo with open space—an empty chair, sofa cushion, or natural standing gap between relatives."
        }
      ],
      donts: [
        {
          title: "Don't upload a group photo as the reference",
          desc: "The reference photo must feature exactly one person. If other people are present, crop the image tightly around your loved one before uploading."
        },
        {
          title: "Avoid sunglasses, heavy shadows, or strong filters",
          desc: "Accessories covering the eyes or intense social media beauty filters obscure facial landmarks and reduce likeness accuracy."
        },
        {
          title: "Don't use extreme conflicting camera angles",
          desc: "A reference portrait taken from a severe bird's-eye overhead angle will look disorienting when placed into an eye-level group shot."
        },
        {
          title: "Don't rely on tiny, pixelated crops",
          desc: "A 100-pixel crop enlarged from a distant party snapshot lacks sufficient facial detail for a high-definition, printable keepsake."
        }
      ]
    },
    showcaseCaptions: [
      {
        beforeLabel: "Separate Photos",
        afterLabel: "Harmonized Photo",
        caption: "Adding a late father into a daughter's wedding portrait, matching outdoor ceremony lighting and posture.",
      },
      {
        beforeLabel: "Separate Photos",
        afterLabel: "Harmonized Photo",
        caption: "Placing a late grandparent naturally into an existing family holiday snapshot.",
      },
    ],
    howItWorks: {
      heading: "Honor Their Memory in 3 Simple Steps",
      subheading: "Creating a memorial keepsake is sensitive work. We ensure a respectful, natural composite in just a few clicks.",
      steps: [
        {
          step: 1,
          title: "Upload Existing Photo & Solo Portrait",
          description: "Select your existing family or wedding photo as the base scene, and upload exactly one clear, solo reference photo of your loved one.",
        },
        {
          step: 2,
          title: "Position & AI Harmonization",
          description: "Choose where they should be placed. Our AI harmonizes perspective, scale, lighting direction, and shadows to naturally integrate them.",
        },
        {
          step: 3,
          title: "Review & High-Res Download",
          description: "Review the composite in your private dashboard. If you're happy with the likeness, download your high-resolution keepsake.",
        },
      ]
    },
    benefits: {
      heading: "A Deeply Meaningful Tribute",
      subheading: "Honoring a loved one is more than just editing a photo. It's about preserving their presence in your family's story.",
      items: [
        {
          title: "A gift for the days that miss them most",
          description: "Weddings, milestone anniversaries, and holidays are when an absence is felt hardest. A portrait with everyone together gives the family something to treasure.",
          icon: "Heart",
        },
        {
          title: "Restore damaged photos first",
          description: "If your only photo of a loved one is damaged, torn, or faded, run it through our Old Photo Restoration tool first. Starting with a clear face yields a far stronger likeness.",
          icon: "Palette",
        },
        {
          title: "Dignified, Natural Results",
          description: "We avoid the cut-and-paste look. The AI calculates realistic depth, contact shadows, and color tones for a respectful tribute.",
          icon: "Image",
        },
      ]
    },
    faq: [
      {
        question: "Can I add a deceased loved one if their photo is black and white?",
        answer: "If your existing base photo is in color, we recommend restoring or colorizing the vintage black-and-white portrait first using our restoration tools for the best color match. If both photos are black and white, BringBack automatically harmonizes contrast, tones, and film grain.",
      },
      {
        question: "Will it really look like them?",
        answer: "BringBack preserves facial structure from your reference photo, but compositing is an AI interpretation rather than an original photograph. Likeness is strongest from a clear, front-facing source. Compare the result carefully against your original in your private dashboard before printing or sharing.",
      },
      {
        question: "What does it cost?",
        answer: `${FEATURE_CREDIT_COSTS.addPerson.credits} credits per run. Credits are bought once and never expire, and there is no subscription. You can regenerate if a likeness or placement needs adjustment.`,
      },
      {
        question: "What if the old photo is low quality or blurry?",
        answer: "We strongly recommend restoring damaged, scratched, or blurry photos first with our Old Photo Restoration tool. Providing a clear reference image gives the AI the best possible facial details to preserve identity.",
      },
      {
        question: "How do I ensure the scale and placement look correct?",
        answer: "Our AI analyzes the depth and perspective of the existing scene to size the person proportionally. You can also specify placement instructions (such as standing next to the bride or seated on a sofa).",
      },
      {
        question: "Can I add multiple deceased family members?",
        answer: "The Add Person tool accepts exactly one reference photo containing one person per run. To add multiple relatives to an existing photo, run the tool sequentially. If you want to create an entirely new group portrait from multiple separate pictures, use our AI Family Portrait tool instead.",
      },
      {
        question: "Will the lighting match if the photos were taken decades apart?",
        answer: "Yes. The AI analyzes the direction and color temperature of the light in your base photo and adjusts the reference subject to match, adding realistic highlights and contact shadows.",
      },
      {
        question: "Are my memorial photos kept private?",
        answer: PRIVACY_COPY.faq,
      },
      {
        question: "Looking to add someone who is not deceased?",
        answer: "If you simply want to add an absent relative, friend, or coworker who missed a group shot or wedding, head over to our main Add Person to Photo tool.",
      },
    ]
  },
};
