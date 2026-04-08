
export interface FeaturePageData {
  slug: string;
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
    trustBadge: string;
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
      inputs: { src: string; label: string }[];
      output: { src: string; label: string };
    };
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
  "individual-photos-into-group": {
    slug: "/features/individual-photos-into-group",
    meta: {
      title: "Create Group Photo from Individual Photos AI | BringBack AI",
      description: "Create a group photo from individual photos online with AI. BringBack AI blends lighting, scale, and perspective to generate realistic family portraits and large group shots from separate pictures.",
      keywords: [
        "create group photo from individual photos ai",
        "create a group photo from individual photos",
        "create a group photo from individual photos online free",
        "create group photo from individual photos",
        "individual photo to group photo ai",
        "individual photos to group photo",
        "generate group photo ai",
        "family portrait from individual photos free",
        "ai family portrait from individual photos online free",
        "20 people group photo",
        "combine photos into one",
        "ai image combiner"
      ],
    },
    hero: {
      h1: "Create a flawless group photo from individual portraits using AI",
      heading: {
        primary: "Create a flawless group photo",
        secondary: "from individual portraits"
      },
      subheadline: "Need to create a group photo from individual photos because your family lives in different cities, countries, or time zones? Upload each portrait, and our AI will match lighting, scale, and perspective to turn separate pictures into one realistic family portrait or large group photo.",
      ctaText: "Create Group Photo Now",
      trustBadge: "Group Portraits",
      
    },
    qualityAnalysis: {
      heading: "Professional Studio-Quality Compositing",
      subheading: "Don't settle for cheap cut-and-paste jobs. Our AI analyzes the 3D structure of each face to relight and position subjects naturally, as if they were photographed together.",
      features: [
        {
          title: "Intelligent Relighting",
          description: "We analyze the primary light source in the target scene and adjust shadows and highlights on every added subject to match perfectly."
        },
        {
          title: "Perspective & Scale Correction",
          description: "Subjects are automatically scaled based on their depth in the scene, ensuring heads and bodies are proportionally correct relative to others."
        },
        {
          title: "Skin Tone Harmonization",
          description: "Color grading is applied globally to unify different camera sensors, white balances, and film stocks into a cohesive look."
        },
        {
          title: "Natural Contact Shadows",
          description: "We generate realistic contact shadows where subjects overlap, grounding them in the scene and eliminating the 'floating sticker' effect."
        }
      ],
      visuals: {
        inputs: [
          { src: "/family-photo1.png", label: "Family member 1" },
          { src: "/family-photo2.jpg", label: "Family member 2" },
          { src: "/family-photo3.png", label: "Family member 3" },
          { src: "/family-photo4.png", label: "Family member 4" }
        ],
        output: { src: "/family-portrait.png", label: "Unified Studio Portrait" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Individual Photos",
        afterLabel: "Combined Portrait",
        caption: "Three siblings living in different countries, combined into a cohesive studio-quality portrait.",
      },
      {
        beforeLabel: "Individual Photos",
        afterLabel: "Combined Portrait",
        caption: "Blending outdoor and indoor portraits into a unified, naturally-lit family photo.",
      },
    ],
    howItWorks: {
      heading: "From Scattered Photos to a Unified Portrait",
      subheading: "If you want to turn individual photos into a group photo online, you do not need Photoshop or manual masking. Upload each person, and our AI handles the lighting, perspective, blending, and layout for you.",
      steps: [
        {
          step: 1,
          title: "Upload Your Snapshots",
          description: "Upload individual photos of each person. Different backgrounds, camera quality, and lighting are fine because the AI is built to normalize them.",
        },
        {
          step: 2,
          title: "AI Unification",
          description: "Our engine analyzes scene geometry, eye level, and light direction to create a realistic group photo from individual photos instead of a fake-looking cut-and-paste collage.",
        },
        {
          step: 3,
          title: "Download & Print",
          description: "Receive your high-resolution AI family portrait, ready to share online, print, frame, or use as a reunion memory.",
        },
      ]
    },
    benefits: {
      heading: "Bring Everyone Together, Finally",
      subheading: "Creating a group photo should not require a studio shoot, travel planning, or waiting for the next reunion. We make it possible from individual photos today.",
      items: [
        {
          title: "Bridge the Distance Instantly",
          description: "Families are spread across the globe. You no longer have to wait years for everyone to be in the same city to update the family portrait. Combine separate photos from different continents into one shared moment.",
          icon: "Globe",
        },
        {
          title: "Perfect Lighting Matching",
          description: "Traditional Photoshop compositing looks fake because the shadows don't match. Our AI reconstructs lighting so every subject shares the same environment, making the result indistinguishable from a real photo.",
          icon: "Sun",
        },
        {
          title: "Works for Small and Large Groups",
          description: "Whether you need a simple 3-person portrait or a 20 people group photo, the layout engine can arrange faces, spacing, and proportions so the final image still feels natural.",
          icon: "Users",
        },
        {
          title: "Save Time & Money",
          description: "Coordinating outfits, booking a studio, and getting everyone together costs hundreds of dollars and hours of time. Create the group portrait online in minutes for a fraction of the cost.",
          icon: "Wallet",
        },
      ]
    },
    faq: [
      {
        question: "Do the individual photos need to have the same background or lighting?",
        answer: "No. Our AI is specifically trained to normalize lighting and remove existing backgrounds. It will generate a cohesive environment for the final group photo.",
      },
      {
        question: "Can I use an ai family portrait from individual photos online free?",
        answer: "We offer free basic upscaling, but generating a complex composite portrait requires advanced processing. We offer highly affordable one-time credit packages starting at $4.99.",
      },
      {
        question: "Are any of these free?",
        answer: "We offer free basic tools like upscaling, but a realistic group photo from individual photos uses heavier AI compositing and is part of our paid credit workflow. That keeps the final result high quality and watermark-free.",
      },
      {
        question: "How many people can I combine into one photo?",
        answer: "Our system can handle multiple subjects. Whether it's a small family of 3 or a large group of 10+, the AI adjusts the layout to fit everyone naturally.",
      },
      {
        question: "Can you make a 20 people group photo from separate pictures?",
        answer: "Yes, large group photos are possible when each face is clearly visible in the source image. For very large groups like 20 people, we recommend using well-lit portraits so the AI can place everyone naturally and preserve facial detail.",
      },
      {
        question: "What resolution do the individual photos need to be?",
        answer: "For the best results, use photos where faces are clear and visible. However, our built-in upscaler can enhance lower-quality images before combining them.",
      },
      {
        question: "Can I create a group photo from individual photos online without Photoshop?",
        answer: "Yes. This page is built exactly for people who want an individual photo to group photo AI workflow without learning Photoshop. Upload the separate portraits and the AI handles blending, relighting, layout, and final export.",
      },
      {
        question: "Can I add a pet to the family portrait?",
        answer: "Absolutely! Our AI recognizes pets just as well as humans. Upload a photo of your dog or cat, and we'll include them in the family group.",
      },
      {
        question: "Is it safe to upload photos of my family?",
        answer: "Yes. Your photos remain yours. Uploaded files are automatically and permanently deleted from our servers within 30 minutes of generating your portrait.",
      },
    ]
  },

  "add-deceased-loved-one-to-photo": {
    slug: "/features/add-deceased-loved-one-to-photo",
    meta: {
      title: "Add Deceased Loved One to Photo AI | BringBack AI",
      description: "Respectfully add a deceased loved one to a current family photo. Our AI blends old and new photos with matched lighting and perspective.",
      keywords: [
        "add deceased loved one to photo ai free online",
        "e possivel ter um retrato falado do meu avo que nunca conhecemos",
        "add person to photo",
        "memorial family portrait"
      ],
    },
    hero: {
      h1: "Respectfully add a deceased loved one to your family photo",
      heading: {
        primary: "Respectfully add a deceased loved one",
        secondary: "to your family photo"
      },
      subheadline: "Bridge the generational gap. Upload an old photo of a lost family member and a current family portrait, and our AI will carefully combine them into a unified, high-resolution memory.",
      ctaText: "Create a Memorial Portrait",
      trustBadge: "Memorial Portraits",
     
    },
    qualityAnalysis: {
      heading: "Respectful & Realistic Memorial Portraits",
      subheading: "We treat your memories with the utmost care. Our AI doesn't just paste faces; it harmonizes textures, lighting, and film grain to make your loved ones look naturally present.",
      features: [
        {
          title: "Automatic Colorization",
          description: "Black and white photos of ancestors are automatically colorized to match the skin tones and lighting of your modern family portrait."
        },
        {
          title: "Facial Restoration",
          description: "Blurry or damaged faces from old prints are enhanced and sharpened before being blended into the new scene."
        },
        {
          title: "Lighting Adaptation",
          description: "We analyze the direction of light in your current photo and relight the added person to cast consistent shadows."
        },
        {
          title: "Scale & Perspective Matching",
          description: "The AI intelligently sizes and positions your loved one to look proportional and grounded, not floating or out of place."
        }
      ],
      visuals: {
        inputs: [
           { src: "/family-photo1.png", label: "Family member 1" },
          { src: "/family-photo2.jpg", label: "Family member 2" },
          { src: "/family-photo3.png", label: "Family member 3" },
          { src: "/family-photo4.png", label: "Family member 4" }
        ],
        output: { src: "/family-portrait.png", label: "United Across Time" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Separate Photos",
        afterLabel: "Unified Family",
        caption: "Adding a grandfather from a 1980s photograph into a 2024 family gathering.",
      },
      {
        beforeLabel: "Separate Photos",
        afterLabel: "Unified Family",
        caption: "A vintage black-and-white portrait colorized and seamlessly placed next to a modern wedding photo.",
      },
    ],
    howItWorks: {
      heading: "Honor Their Memory in 3 Simple Steps",
      subheading: "Creating a memorial portrait is sensitive work. We've made the process respectful, automated, and high-quality.",
      steps: [
        {
          step: 1,
          title: "Upload Photos",
          description: "Select your current family photo and a photo of your loved one. Even old, blurry, or black-and-white photos work.",
        },
        {
          step: 2,
          title: "Restoration & Blending",
          description: "Our AI first restores and colorizes the vintage photo, then seamlessly blends it into the modern scene with matching lighting.",
        },
        {
          step: 3,
          title: "A Timeless Gift",
          description: "Download a beautiful, high-resolution portrait that brings your entire family together again.",
        },
      ]
    },
    benefits: {
      heading: "A Deeply Meaningful Tribute",
      subheading: "Honoring a loved one is more than just editing a photo. It's about preserving their presence in your family's story.",
      items: [
        {
          title: "The Most Impactful Gift",
          description: "There is no more emotional gift for a wedding, anniversary, or memorial service than a portrait showing the entire family together across time. It brings tears of joy and comfort.",
          icon: "Heart",
        },
        {
          title: "Restore & Revitalize",
          description: "Don't worry if the photo of your loved one is old, faded, or black-and-white. Our AI automatically restores and colorizes the face before blending it, giving it a new life.",
          icon: "Palette",
        },
        {
          title: "Dignified, Natural Results",
          description: "We avoid the 'cut and paste' look. The AI ensures the added family member casts realistic shadows and matches the color temperature of the modern photo for a respectful tribute.",
          icon: "Image",
        },
      ]
    },
    faq: [
      {
        question: "Can I add a deceased loved one if their photo is black and white?",
        answer: "Yes. The AI will automatically colorize the older black-and-white photo to match the natural skin tones and lighting of the modern family photo.",
      },
      {
        question: "What if the old photo is low quality or blurry?",
        answer: "Our system runs a facial restoration and upscaling process on the old photo first, ensuring the face is sharp and clear before merging it into the new photo.",
      },
      {
        question: "How do I ensure the scale looks correct?",
        answer: "Our AI analyzes the depth and perspective of the base photo to automatically size the added person correctly. You don't need to manually resize anything.",
      },
      {
        question: "Can I add multiple deceased family members?",
        answer: "Yes, you can upload multiple individual photos. The AI will position them together with the living family members in a natural arrangement.",
      },
      {
        question: "Will the lighting match if the photos were taken decades apart?",
        answer: "Yes. Our relighting engine analyzes the light direction in the modern photo and applies it to the vintage subject, casting realistic shadows.",
      },
      {
        question: "Are my memorial photos kept private?",
        answer: "Absolutely. We treat all uploads with strict privacy. Your photos are automatically and permanently deleted from our servers within 30 minutes.",
      },
    ]
  },

  "black-and-white-composite": {
    slug: "/features/black-and-white-composite",
    meta: {
      title: "Black and White Family Portrait from Separate Photos | BringBack AI",
      description: "Turn separate photos into a timeless black and white family portrait. Merge old and new pictures, match tones, repair damage, and create vintage wall art.",
      keywords: [
        "black and white family portrait from separate photos",
        "create black and white family portrait online",
        "black and white composite family portrait",
        "merge old and new family photos",
        "combine black and white and color photos",
        "vintage family portrait from individual photos",
        "memorial black and white family portrait",
        "merge black and white photos",
        "classic family portrait composite"
      ],
    },
    hero: {
      h1: "Create a black and white family portrait from separate photos",
      heading: {
        primary: "Create a black and white",
        secondary: "family portrait from separate photos"
      },
      subheadline: "Merge old black and white photos with newer color pictures to create one timeless family portrait. Our AI restores damage, matches tones, and builds a realistic vintage composite ready for framing.",
      ctaText: "Create Vintage Composite",
      trustBadge: "Timeless Portraits",
     
    },
    qualityAnalysis: {
      heading: "A Vintage Composite That Looks Like One Original Portrait",
      subheading: "If you want a black and white family portrait from separate photos, monochrome is often the best choice. It removes color mismatches, softens era differences, and makes old scans and modern portraits feel naturally connected.",
      features: [
        {
          title: "Black and White Tone Matching",
          description: "We analyze every source photo and rebuild the luminance so each face shares the same black and white tonal range instead of looking like separate edits."
        },
        {
          title: "Old Photo Repair Before Merging",
          description: "Scratches, dust, fading, and small tears in vintage family photos are cleaned up before compositing, which gives the final portrait a much more polished look."
        },
        {
          title: "Film Grain and Texture Blending",
          description: "If one image comes from film and another comes from a phone camera, we harmonize grain and texture so the final black and white portrait feels cohesive."
        },
        {
          title: "Print-Ready Contrast Control",
          description: "We balance highlights, shadows, and midtones for a black and white family portrait that stays elegant on screen and holds detail when printed large."
        }
      ],
      visuals: {
        inputs: [
           { src: "/family-photo1.png", label: "Family member 1" },
          { src: "/family-photo2.jpg", label: "Family member 2" },
          { src: "/family-photo3.png", label: "Family member 3" },
          { src: "/family-photo4.png", label: "Family member 4" }
        ],
        output: { src: "/vintage-family-portraits.webp", label: "Timeless Classic" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Mixed Sources",
        afterLabel: "Classic Composite",
        caption: "Combining a 1950s black and white portrait with a recent color photo into one seamless vintage family portrait.",
      },
      {
        beforeLabel: "Separate Portraits",
        afterLabel: "Unified B&W",
        caption: "Turning separate photos into a black and white family portrait that looks consistent enough for framing or memorial display.",
      },
    ],
    howItWorks: {
      heading: "From Separate Photos to One Vintage Family Portrait",
      subheading: "You do not need Photoshop to create a black and white composite family portrait. Upload the photos, and our AI handles restoration, monochrome conversion, tone matching, and final layout.",
      steps: [
        {
          step: 1,
          title: "Upload Old and New Photos",
          description: "Add scans of vintage prints, recent phone photos, or studio portraits. Mixed sources are fine, even when one image is black and white and another is full color.",
        },
        {
          step: 2,
          title: "Restore and Unify",
          description: "Our AI repairs visible damage, converts or preserves monochrome tones, and blends lighting, grain, and contrast so the family portrait feels like a single original shot.",
        },
        {
          step: 3,
          title: "Download and Frame",
          description: "Receive a high-resolution black and white family portrait that is ready for wall art, memorial prints, gifts, or archival keepsakes.",
        },
      ]
    },
    benefits: {
      heading: "Why Black and White Works So Well for Composite Portraits",
      subheading: "A monochrome family portrait solves most of the blending problems that make separate photos look fake, while also giving the final image a more timeless emotional feel.",
      items: [
        {
          title: "Timeless Aesthetic",
          description: "A black and white family portrait feels elegant, classic, and less dated than heavily color-graded composites. It fits both modern homes and heritage displays.",
          icon: "Camera",
        },
        {
          title: "Better Blending Across Different Photos",
          description: "Removing color differences makes it much easier to merge old scans, faded prints, and modern digital portraits into one believable family portrait from separate photos.",
          icon: "Layers",
        },
        {
          title: "Ideal for Memorial and Tribute Portraits",
          description: "Black and white is a natural fit when you want to honor parents, grandparents, or ancestors and bring generations together in a respectful, emotionally strong composition.",
          icon: "History",
        },
        {
          title: "Made for Framing",
          description: "The final result is designed to work beautifully as printed wall art, remembrance gifts, anniversary presents, or a centerpiece family portrait in your home.",
          icon: "Printer",
        },
      ]
    },
    faq: [
      {
        question: "Can I create a black and white family portrait from separate photos?",
        answer: "Yes. This page is built specifically for turning separate photos into one black and white family portrait. Upload each person individually, and the AI blends them into a single realistic composition.",
      },
      {
        question: "Can I combine color and black & white photos?",
        answer: "Yes. We can merge modern color portraits with vintage black and white photos by converting everything into a consistent monochrome style and matching the tone curve across all subjects.",
      },
      {
        question: "Can you merge old family photos with recent pictures?",
        answer: "Yes. This is one of the strongest use cases for a vintage composite. Older family photos can be restored and then blended with newer portraits into a single black and white image.",
      },
      {
        question: "Does the AI fix scratches on old photos before merging them?",
        answer: "Yes. Our restoration engine automatically repairs many common issues like dust, fading, scratches, and light tears before building the final black and white composite.",
      },
      {
        question: "Is black and white better than full color for composite portraits?",
        answer: "Often, yes. Black and white removes color mismatch between cameras, lighting setups, and time periods, which usually makes separate photos look more naturally unified.",
      },
      {
        question: "Can I choose the contrast or vintage look?",
        answer: "Yes. The default style is balanced and classic, but black and white composites can be guided toward softer vintage tones, richer contrast, or a more dramatic fine-art look.",
      },
      {
        question: "Will the resolution be high enough to print and frame?",
        answer: "Yes. We upscale and optimize the final portrait so it is sharp enough for photo paper, canvas, and framed wall prints.",
      },
      {
        question: "Is this good for memorial or tribute family portraits?",
        answer: "Yes. A black and white composite is one of the best formats for memorial portraits because it respectfully brings together generations and reduces visual differences between old and new photos.",
      },
      {
        question: "How do you handle different film grain textures?",
        answer: "We study the grain and texture in the vintage source and adapt newer images to match, which helps the final portrait feel like it came from one original session.",
      },
      {
        question: "Is this safe?",
        answer: "Yes. Your privacy is our priority. All uploaded and generated images are deleted permanently within 30 minutes.",
      },
    ]
  },

  "father-and-child-portrait": {
    slug: "/features/father-and-child-portrait",
    meta: {
      title: "Create Realistic Father and Child Portrait AI | BringBack AI",
      description: "Merge photos of father and child into a single, heartwarming portrait. Perfect for gifts or when you don't have a recent photo together.",
      keywords: [
        "i want a realistic photo me and my father",
        "merge father and child photo",
        "create photo with dad",
        "father's day photo gift"
      ],
    },
    hero: {
      h1: "Create a realistic photo of you and your father",
      heading: {
        primary: "Create a realistic photo",
        secondary: "of you and your father"
      },
      subheadline: "Don't have a recent photo together? Merge individual photos into a natural, heartwarming portrait perfect for Father's Day or birthdays.",
      ctaText: "Create Portrait with Dad",
      trustBadge: "Father & Child",

    },
    qualityAnalysis: {
      heading: "Generational Connection Perfected",
      subheading: "Creating a believable moment between father and child requires more than just placement. We focus on the subtle interactions of light and emotion.",
      features: [
        {
          title: "Height & Scale Analysis",
          description: "Our AI estimates the physical height of subjects to position them realistically next to each other, whether sitting or standing."
        },
        {
          title: "Eye Contact Correction",
          description: "We subtly adjust gaze direction so subjects appear to be looking at the same camera or interacting with each other."
        },
        {
          title: "Uniform Lighting",
          description: "Shadows on faces are recalculated to ensure both father and child are illuminated by the same virtual light source."
        },
        {
          title: "Background Replacement",
          description: "We replace distracting original backgrounds with a neutral or scenic studio setting that ties the portrait together."
        }
      ],
      visuals: {
        inputs: [
          { src: "/family-photo1.png", label: "Family member 1" },
          { src: "/family-photo2.jpg", label: "Family member 2" },
          { src: "/family-photo3.png", label: "Family member 3" },
          { src: "/family-photo4.png", label: "Family member 4" }
        ],
        output: { src: "/family-portrait.png", label: "Reunited" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Separate Photos",
        afterLabel: "Together",
        caption: "Merging a photo of dad at work and a child at home into a shared moment.",
      },
      {
        beforeLabel: "Old & New",
        afterLabel: "Reunited",
        caption: "Combining a vintage photo of a young father with a current photo of his adult child.",
      },
    ],
    howItWorks: {
      heading: "The Perfect Father's Day Gift",
      subheading: "Create the photo you wish you had. Our AI makes it look like you were in the same studio, even if you're miles apart.",
      steps: [
        {
          step: 1,
          title: "Choose Your Best Shots",
          description: "Upload a photo of your father and one of yourself. Casual or formal—we can work with both.",
        },
        {
          step: 2,
          title: "Intelligent Composition",
          description: "Our AI adjusts height differences, eye contact, and lighting to create a natural, connected moment.",
        },
        {
          step: 3,
          title: "A Meaningful Surprise",
          description: "Download the high-quality file instantly. Perfect for framing, mugs, or canvas prints.",
        },
      ]
    },
    benefits: {
      heading: "A Gift He Will Cherish Forever",
      subheading: "Capture the bond between father and child in a way that time or distance might have prevented.",
      items: [
        {
          title: "Make Up for Lost Time",
          description: "Life gets busy, and sometimes we miss the chance to take photos. Create the perfect memory now, regardless of when you last saw each other.",
          icon: "Heart",
        },
        {
          title: "The Ultimate Surprise",
          description: "Imagine his reaction when he sees a framed, realistic photo of the two of you together. It's a gift that speaks louder than words.",
          icon: "Gift",
        },
        {
          title: "Gallery-Worthy Quality",
          description: "Our composites are generated in high resolution with professional color grading, making them perfect for large canvas prints.",
          icon: "Printer",
        },
      ]
    },
    faq: [
      {
        question: "Can I use an old photo of my father?",
        answer: "Yes, we can combine old and new photos. We can even colorize the old photo first to match yours.",
      },
      {
        question: "What if I'm taller than my father now?",
        answer: "Our AI can adjust the relative heights to be realistic, or you can specify if you want to be seated or standing to mask the difference.",
      },
      {
        question: "Can we add siblings to the portrait?",
        answer: "Yes, you can add multiple family members. The AI will arrange everyone around the father figure naturally.",
      },
      {
        question: "How long does it take?",
        answer: "The process is automated and takes just a few seconds once you upload the photos.",
      },
      {
        question: "Is the result suitable for a canvas print?",
        answer: "Absolutely. We output high-resolution files (up to 4K) specifically optimized for large-format printing.",
      },
      {
        question: "Is my data private?",
        answer: "Yes, photos are deleted automatically after 30 minutes. We respect your family's privacy.",
      },
    ]
  },

  "merge-images": {
    slug: "/features/merge-images",
    meta: {
      title: "Merge Images Online with AI | BringBack AI",
      description: "Seamlessly merge two or more images into one. Our AI handles blending, lighting, and perspective for natural-looking results.",
      keywords: [
        "merge images online",
        "combine pictures ai",
        "blend photos together",
        "ai photo merger"
      ],
    },
    hero: {
      h1: "Seamlessly merge images with professional AI blending",
      heading: {
        primary: "Seamlessly merge images",
        secondary: "with professional AI blending"
      },
      subheadline: "Combine subjects from different photos into a single, natural scene. Perfect for creative projects, family albums, and professional composites.",
      ctaText: "Merge Images Now",
      trustBadge: "Pro Blending",

    },
    qualityAnalysis: {
      heading: "Advanced AI Image Blending",
      subheading: "Merging images is an art. Our AI handles the tedious masking and color matching, giving you creative freedom without the technical headache.",
      features: [
        {
          title: "Precision Masking",
          description: "Our AI identifies subject boundaries down to the hair strand, ensuring clean extractions without jagged edges."
        },
        {
          title: "Ambient Light Matching",
          description: "We analyze the color temperature of the new background and adjust the subject to match, so they don't look pasted in."
        },
        {
          title: "Depth of Field Simulation",
          description: "If the background is blurry, we can intelligently soften the subject's edges to match the camera's focus plane."
        },
        {
          title: "Noise & Grain Uniformity",
          description: "Digital noise patterns are equalized across all elements to make the final composite look like a single camera capture."
        }
      ],
      visuals: {
        inputs: [
          { src: "/family-photo1.png", label: "Family member 1" },
          { src: "/family-photo2.jpg", label: "Family member 2" },
          { src: "/family-photo3.png", label: "Family member 3" },
          { src: "/family-photo4.png", label: "Family member 4" }
        ],
        output: { src: "/family-portrait.png", label: "Seamless Blend" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Source A + Source B",
        afterLabel: "Merged Result",
        caption: "Taking subjects from two different backgrounds and placing them in a new, unified setting.",
      },
      {
        beforeLabel: "Separate Elements",
        afterLabel: "Composite",
        caption: "Blending foreground and background elements for a creative composition.",
      },
    ],
    howItWorks: {
      heading: "Professional Image Merging Made Simple",
      subheading: "Combine elements from multiple photos into a single, seamless composition without learning Photoshop.",
      steps: [
        {
          step: 1,
          title: "Select Your Elements",
          description: "Upload the background and the subjects you want to add. We support all common formats.",
        },
        {
          step: 2,
          title: "Automated Blending",
          description: "Our AI handles the difficult masking, edge feathering, and color matching instantly.",
        },
        {
          step: 3,
          title: "Creative Results",
          description: "Download your high-resolution composite, ready for your portfolio or social media.",
        },
      ]
    },
    benefits: {
      heading: "Professional Compositing for Everyone",
      subheading: "You don't need a design degree to create stunning, complex image merges.",
      items: [
        {
          title: "Seamless Realism",
          description: "No more jagged edges or mismatched lighting. Our AI understands physics and light to create believable scenes.",
          icon: "Blend",
        },
        {
          title: "Unleash Creativity",
          description: "Combine people, places, and objects in ways reality didn't permit. The only limit is your imagination.",
          icon: "Palette",
        },
        {
          title: "Workflow Speed",
          description: "What used to take an hour of meticulous masking in Photoshop now takes seconds. Focus on the idea, not the tool.",
          icon: "Clock",
        },
      ]
    },
    faq: [
      {
        question: "Can I merge more than two photos?",
        answer: "Currently, our tool is optimized for merging two main sources, but you can run the process multiple times to add more elements.",
      },
      {
        question: "Can I use this for commercial projects?",
        answer: "Yes, our paid plans include a commercial license. You own the copyright to your generated composite images.",
      },
      {
        question: "Does it work with complex backgrounds?",
        answer: "Yes, our AI is excellent at separating subjects from complex backgrounds like trees, hair, or crowds.",
      },
      {
        question: "What file formats do you support?",
        answer: "We support JPG, PNG, WEBP, and TIFF files up to 50MB in size.",
      },
      {
        question: "How do I fix the lighting match?",
        answer: "The AI automatically adjusts the subject's lighting to match the background, but you can fine-tune the brightness and warmth manually.",
      },
      {
        question: "Is it free to try?",
        answer: "We offer paid high-quality processing to ensuring the best results without watermarks.",
      },
    ]
  },
   "ai-image-combiner": {
    slug: "/features/ai-image-combiner",
    meta: {
      title: "AI Image Combiner | Combine Photos Online",
      description: "Combine multiple photos into one with our AI Image Combiner. Perfect for collages, comparisons, and creative composites.",
      keywords: ["ai image combiner", "combine photos online", "photo joiner ai", "image merger"],
    },
    hero: {
      h1: "Smart AI Image Combiner for perfect compositions",
      heading: {
        primary: "Smart AI Image Combiner",
        secondary: "for perfect compositions"
      },
      subheadline: "Automatically combine photos with intelligent layout and blending. Ideal for social media, presentations, and personal memories.",
      ctaText: "Combine Photos",
      trustBadge: "Smart Combiner",

    },
    qualityAnalysis: {
      heading: "Intelligent Photo Combination",
      subheading: "More than just a collage maker. Our AI understands image content to suggest layouts that respect focal points and composition.",
      features: [
        {
          title: "Content-Aware Layouts",
          description: "The AI detects faces and important objects to ensure they are never cropped out or obscured in the final layout."
        },
        {
          title: "Auto-Balancing",
          description: "Visual weight is distributed evenly, so one bright photo doesn't overpower the darker ones."
        },
        {
          title: "Smart Borders",
          description: "Clean, consistent spacing is applied automatically, with optional color sampling from the images themselves."
        },
        {
          title: "Resolution Upscaling",
          description: "Small source photos are upscaled before combination to ensure the final composite is sharp and print-ready."
        }
      ],
      visuals: {
        inputs: [
          { src: "/family-photo1.png", label: "Family member 1" },
          { src: "/family-photo2.jpg", label: "Family member 2" },
          { src: "/family-photo3.png", label: "Family member 3" },
          { src: "/family-photo4.png", label: "Family member 4" }
        ],
        output: { src: "/family-portrait.png", label: "Balanced Composition" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Multiple Inputs",
        afterLabel: "Combined Output",
        caption: "Intelligently arranging multiple photos into a balanced single image.",
      },
      {
        beforeLabel: "Before",
        afterLabel: "After",
        caption: "Combining landscape and portrait photos into a cohesive layout.",
      },
    ],
    howItWorks: {
      heading: "Combine Photos with Intelligence",
      subheading: "Stop struggling with manual layouts. Let AI arrange, balance, and blend your photos into a perfect composition.",
      steps: [
        {
          step: 1,
          title: "Choose Your Collection",
          description: "Select multiple photos for a collage, comparison, or story layout.",
        },
        {
          step: 2,
          title: "Smart Arrangement",
          description: "Our engine detects the focal points in each image and arranges them so nothing important is cropped or hidden.",
        },
        {
          step: 3,
          title: "Share Your Story",
          description: "Download a beautifully balanced image that tells the whole story at a glance.",
        },
      ]
    },
    benefits: {
      heading: "Tell a Bigger Story",
      subheading: "One photo isn't always enough. Combine multiple perspectives into a single, powerful image.",
      items: [
        {
          title: "Intelligent Composition",
          description: "Our AI doesn't just stack photos; it analyzes them to find the most balanced, aesthetically pleasing arrangement.",
          icon: "Layout",
        },
        {
          title: "Preserve Original Quality",
          description: "We upscale and enhance small source images so your final combination is sharp, clear, and print-ready.",
          icon: "Maximize",
        },
        {
          title: "Instant Results",
          description: "Skip the manual resizing and alignment. Get a professional-looking layout in seconds.",
          icon: "Zap",
        },
      ]
    },
    faq: [
      {
        question: "How many photos can I combine?",
        answer: "You can combine up to 12 photos in a single grid or collage layout.",
      },
      {
        question: "Can I adjust the spacing and borders?",
        answer: "Yes, you can customize the border thickness, color, and corner roundness.",
      },
      {
        question: "Is there a watermark?",
        answer: "Our premium service provides watermark-free high-resolution downloads.",
      },
      {
        question: "Can I add text to the collage?",
        answer: "Yes, we have a built-in text editor with various fonts and styles.",
      },
      {
        question: "What is the maximum output resolution?",
        answer: "We support up to 8K resolution export, perfect for large posters or digital displays.",
      },
      {
        question: "Can I save my layout for later?",
        answer: "Yes, create a free account to save your projects and re-edit them anytime.",
      },
    ]
  },
  "photo-joiner": {
    slug: "/features/photo-joiner",
    meta: {
      title: "Photo Joiner AI | Join Photos Together Online",
      description: "Join photos together side-by-side or vertically with AI. Create seamless panoramas or before/after comparisons easily.",
      keywords: ["photo joiner", "join photos online", "stitch photos together", "ai panorama stitcher"],
    },
    hero: {
      h1: "Join photos together effortlessly with AI",
      heading: {
        primary: "Join photos together",
        secondary: "effortlessly with AI"
      },
      subheadline: "Whether it's a panorama, a before/after shot, or a photo strip, join your images perfectly in seconds.",
      ctaText: "Join Photos Now",
      trustBadge: "Seamless Join",
      images: {
        inputs: ["/vintage-street.webp", "/vintage-street.webp"],
        output: "/vintage-street.webp"
      }
    },
    qualityAnalysis: {
      heading: "Seamless Panoramic Stitching",
      subheading: "Creating a wide shot from multiple photos used to be hard. Our AI finds the overlap and stitches them invisibly.",
      features: [
        {
          title: "Overlap Detection",
          description: "We analyze common features between photos to align them perfectly, even if they were shot handheld."
        },
        {
          title: "Exposure Compensation",
          description: "Variations in brightness between shots are smoothed out so the sky doesn't change color halfway through."
        },
        {
          title: "Distortion Correction",
          description: "Lens distortion is corrected at the edges to prevent the 'fish-eye' warping common in wide panoramas."
        },
        {
          title: "Ghost Removal",
          description: "If moving objects (like cars or people) appear in the overlap, we intelligently remove the ghosting artifacts."
        }
      ],
      visuals: {
        inputs: [
          { src: "/vintage-street.webp", label: "Left View" },
          { src: "/vintage-street.webp", label: "Right View" }
        ],
        output: { src: "/vintage-street.webp", label: "Wide Panorama" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Part 1 + Part 2",
        afterLabel: "Joined Photo",
        caption: "Stitching two overlapping photos into a wide panorama.",
      },
      {
        beforeLabel: "Left + Right",
        afterLabel: "Side-by-Side",
        caption: "Creating a clean side-by-side comparison image.",
      },
    ],
    howItWorks: {
      heading: "Join Photos Seamlessly in Seconds",
      subheading: "Whether you're making a panorama or a side-by-side comparison, our AI handles the alignment for you.",
      steps: [
        {
          step: 1,
          title: "Upload Your Sequence",
          description: "Upload two or more overlapping photos or distinct images you want to place side-by-side.",
        },
        {
          step: 2,
          title: "Select Your Mode",
          description: "Choose 'Panorama' for seamless stitching or 'Grid' for clean, structured layouts.",
        },
        {
          step: 3,
          title: "Download High-Res",
          description: "Get a wide, high-quality image that captures the full view without distortion.",
        },
      ]
    },
    benefits: {
      heading: "See the Whole Picture",
      subheading: "Capture wide landscapes, before-and-after comparisons, and panoramic views without distortion.",
      items: [
        {
          title: "Flawless Panoramas",
          description: "Our AI finds the perfect stitching points and blends exposure differences for a seamless wide shot.",
          icon: "Minimize",
        },
        {
          title: "Creative Comparisons",
          description: "Perfectly align 'before' and 'after' shots to show progress, changes, or transformations side-by-side.",
          icon: "Grid",
        },
        {
          title: "No Technical Skills Needed",
          description: "Don't worry about focal lengths or lens distortion. Just upload, and we handle the geometry.",
          icon: "Mouse",
        },
      ]
    },
    faq: [
      {
        question: "Can I join photos of different sizes?",
        answer: "Yes, our tool automatically handles resizing to make edges match perfectly.",
      },
      {
        question: "Is it good for panoramas?",
        answer: "Yes, the AI is excellent at finding overlap and stitching panoramic shots.",
      },
      {
        question: "Can I stitch photos vertically?",
        answer: "Yes, you can choose between horizontal (side-by-side) or vertical (top-to-bottom) stacking.",
      },
      {
        question: "Will the final image be blurry?",
        answer: "No, we preserve the original quality and can even upscale the result if needed.",
      },
      {
        question: "Can I add a border between joined photos?",
        answer: "Yes, you can add a customizable border with any color or thickness.",
      },
      {
        question: "Is my data safe?",
        answer: "Yes, all images are deleted after 30 minutes.",
      },
    ]
  },
  "add-person-to-photo": {
    slug: "/features/add-person-to-photo",
    meta: {
      title: "Add Person to Photo AI | BringBack AI",
      description: "Add a person to an existing photo naturally using AI. Perfect for when someone missed the group shot.",
      keywords: ["add person to photo", "include someone in photo ai", "add me to photo", "ai photo manipulation"],
    },
    hero: {
      h1: "Add a missing person to your photo naturally",
      heading: {
        primary: "Add a missing person",
        secondary: "to your photo naturally"
      },
      subheadline: "Did someone miss the group photo? Add them in later with AI that matches lighting, shadows, and perspective perfectly.",
      ctaText: "Add Person to Photo",
      trustBadge: "Add Person",
      images: {
        inputs: ["/family-photo1.png", "/avatar5.webp"],
        output: "/family-portrait.png"
      }
    },
    qualityAnalysis: {
      heading: "Realistic Person Integration",
      subheading: "Adding a person to a photo is easy. Making it look like they were actually there is hard. Our AI handles the physics of light and space.",
      features: [
        {
          title: "Lighting & Shadow Match",
          description: "We re-light the added person to match the direction, intensity, and color of the light sources in the main photo."
        },
        {
          title: "Perspective Alignment",
          description: "The AI calculates the vanishing point of the scene and adjusts the subject's angle so they fit the ground plane correctly."
        },
        {
          title: "Color Grading",
          description: "We match the white balance, saturation, and contrast of the added person to the rest of the group."
        },
        {
          title: "Soft Edge Blending",
          description: "Hair and clothes are blended naturally with the background to avoid the fake 'cutout' look."
        }
      ],
      visuals: {
        inputs: [
          { src: "/family-photo1.png", label: "Group" },
          { src: "/avatar5.webp", label: "Missing Person" }
        ],
        output: { src: "/family-portrait.png", label: "Complete Group" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Group + Individual",
        afterLabel: "Complete Group",
        caption: "Adding a friend who arrived late to the group dinner photo.",
      },
      {
        beforeLabel: "Photo A + Photo B",
        afterLabel: "Combined",
        caption: "Placing a person into a scenic travel background they couldn't visit.",
      },
    ],
    howItWorks: {
      heading: "No One Misses the Shot",
      subheading: "Forgot to invite someone? Or they couldn't make it? Add them in later as if they were there all along.",
      steps: [
        {
          step: 1,
          title: "Select Your Photos",
          description: "Upload the group photo and a separate photo of the person you want to add.",
        },
        {
          step: 2,
          title: "Natural Integration",
          description: "Our AI matches the lighting, perspective, and scale to blend the new person seamlessly into the group.",
        },
        {
          step: 3,
          title: "Download the Complete Memory",
          description: "Get a flawless group photo where everyone is present and looking their best.",
        },
      ]
    },
    benefits: {
      heading: "No More 'Missing' Friends",
      subheading: "Ensure everyone is part of the memory, even if they were late, behind the camera, or far away.",
      items: [
        {
          title: "Complete the Group",
          description: "Never leave a friend or family member out again. Add them in so the memory is complete for everyone.",
          icon: "Users",
        },
        {
          title: "Photorealism Guaranteed",
          description: "Our AI relighting engine ensures the added person looks like they were standing there when the shutter clicked.",
          icon: "Sun",
        },
        {
          title: "Grounded & Natural",
          description: "We generate realistic contact shadows and depth cues so subjects don't look like floating stickers.",
          icon: "Cloud",
        },
      ]
    },
    faq: [
      {
        question: "Does the person need to be on a plain background?",
        answer: "No, our AI can automatically remove the background from the person's photo.",
      },
      {
        question: "Can I add multiple people?",
        answer: "Yes, you can repeat the process to add multiple people.",
      },
      {
        question: "How do I make it look real?",
        answer: "Our AI handles the lighting and shadows. Just ensure the angle of the person matches the group photo.",
      },
      {
        question: "Can I resize the person?",
        answer: "Yes, you can scale, rotate, and flip the person to fit perfectly.",
      },
      {
        question: "What if the person is cut off in their original photo?",
        answer: "It's best to place them behind someone or at the edge of the frame if their body is partially cropped.",
      },
      {
        question: "Will it look fake?",
        answer: "Our advanced AI focuses on lighting and perspective matching to ensure a natural look.",
      },
    ]
  }
};
