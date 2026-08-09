export interface AppPageData {
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
  appStoreFriction?: {
    heading: string;
    body: string;
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

export const appData: Record<string, AppPageData> = {
  "back-to-life-photo-app": {
    slug: "/app/back-to-life-photo-app",
    meta: {
      title: "Back to Life Photo App — Animate Old Family Photos in Your Browser",
      description: "Bring old family photos back to life with gentle, realistic motion. Runs in your phone browser — no app store download, no subscription. 10 credits per animation.",
      keywords: [
        "back to life app",
        "backtolife app",
        "bring your loved ones back to life app",
        "bring photos to life app",
        "animate old photos app",
        "photo animator app",
        "bring pictures to life"
      ],
    },
    hero: {
      h1: "A back to life photo app that runs in your browser",
      heading: {
        primary: "Bring your loved ones",
        secondary: "back to life"
      },
      subheadline: "Turn a still portrait into a short, gentle video — a blink, a soft smile, a small turn of the head. It runs in Safari or Chrome on your phone, so there is nothing to install.",
      ctaText: "Animate Your First Photo",
      trustBadge: "Pay once — no subscription",
    },
    appStoreFriction: {
      heading: "Why there is no app to download",
      body: "Most \"back to life\" tools ship as a native app: a few hundred megabytes, an account, and a subscription before you see a single result. BringBack runs as a web app instead. You open a link, upload one photo, and get your animation back. Nothing is installed on your phone, and nothing keeps billing you after you stop using it."
    },
    qualityAnalysis: {
      heading: "What the animation actually does",
      subheading: "Small, believable motion — not a puppet show.",
      features: [
        {
          title: "Subtle facial motion",
          description: "The model animates the face it can see: eyes blink, the mouth shifts into a soft smile, the head turns slightly. It works from the single frame you upload, so motion stays within what the original portrait supports."
        },
        {
          title: "Restore first, then animate",
          description: "Damage and blur get amplified once a photo starts moving. Running restoration before animation gives the model cleaner facial detail to work from, which is why the two steps live in the same workflow here."
        },
        {
          title: "Your photos stay yours",
          description: "You upload one photo at a time — we never read your camera roll. Results stay in your account until you delete them, and we do not use your family photos to train general-purpose AI models."
        }
      ],
      visuals: {
        inputs: [
          { src: "/gentle-smile.webp", label: "Original Portrait" },
        ],
        output: { src: "/videos/gentle-smile.mp4", label: "Back to Life Animation" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Static Portrait",
        afterLabel: "Alive Again",
        caption: "A 1920s portrait brought to life with natural head movement and a gentle smile."
      },
      {
        beforeLabel: "Faded Memory",
        afterLabel: "Vivid Moment",
        caption: "Restored color and animation reveal the personality behind the faded print."
      }
    ],
    howItWorks: {
      heading: "How to bring an old photo back to life",
      subheading: "Three steps, about a minute end to end.",
      steps: [
        {
          step: 1,
          title: "Upload one portrait",
          description: "Pick the clearest front-facing photo you have. A sharp face matters far more than a large file — a good phone snapshot of a print beats a blurry high-resolution scan."
        },
        {
          step: 2,
          title: "Restore it first if it is damaged",
          description: "If the photo is torn, faded, or soft, run restoration before animating. Motion exaggerates whatever damage is already there, so the cleanup step is worth it."
        },
        {
          step: 3,
          title: "Animate and download",
          description: "You get a short silent MP4 that loops. Save it to your phone and share it. Compare it against the original before you send it on — AI reconstructs detail it cannot recover."
        }
      ]
    },
    benefits: {
      heading: "What people use it for",
      subheading: "Mostly family history, and mostly for someone who is gone.",
      items: [
        {
          title: "Ancestry & genealogy",
          description: "Put a moving face to a name in your family tree. Seeing a great-grandparent blink lands differently than reading a census record.",
          icon: "History"
        },
        {
          title: "Memorial tributes",
          description: "A short animated clip for a funeral slideshow or an anniversary — a way to include someone who is no longer here.",
          icon: "Heart"
        },
        {
          title: "Sharing with family",
          description: "The output is a plain MP4, so it sends over WhatsApp or a family group chat without anyone needing an account.",
          icon: "Users"
        }
      ]
    },
    faq: [
      {
        question: "What is the best app to bring pictures to life?",
        answer: "For old family photos, look for a tool that restores damage before it animates — motion exaggerates scratches, blur, and fading. BringBack does both in one workflow and runs in the browser, so there is no download. Tools built for selfies or generic video effects tend to struggle with vintage prints."
      },
      {
        question: "Can I use this to animate a photo of someone who has died?",
        answer: "Yes, and that is what most people use it for. The animation is deliberately restrained — a blink, a small smile, a slight head turn — because exaggerated motion tends to feel wrong on a memorial photo. You can preview the result before you share it."
      },
      {
        question: "Do I need to install anything?",
        answer: "No. It runs in Safari, Chrome, or any modern browser on iPhone, Android, tablet, or desktop. There is no app store download and no account required from a phone's app store."
      },
      {
        question: "Is BringBack free?",
        answer: "No. BringBack is a paid service. Animation costs 10 credits per run because each one is compute-intensive. Credits are bought once and never expire — there is no subscription."
      },
      {
        question: "How good does my original photo need to be?",
        answer: "The face needs to be recognisable and roughly front-facing. Heavy blur, deep creases across the face, or a subject turned far to one side will limit what the model can do. Restoring the photo first usually improves the animation noticeably."
      },
      {
        question: "Will it look like the real person?",
        answer: "It reconstructs plausible motion from one still frame, so it is an interpretation, not footage. Faces generally stay recognisable, but always compare the result against your original before sharing it — especially for a memorial."
      }
    ]
  },
  "make-pictures-smile": {
    slug: "/app/make-pictures-smile",
    meta: {
      title: "App That Makes Pictures Move and Smile",
      description: "Discover the best app to make old photos move and smile. Turn static portraits into lifelike animations instantly. Try our online tool now.",
      keywords: [
        "app that makes pictures move and smile",
        "app to make old photos move",
        "app for old photos come to life",
        "make photos smile app",
        "picture animator app",
        "photo motion app",
        "animate face app"
      ],
    },
    hero: {
      h1: "The App That Makes Pictures Move and Smile Instantly",
      heading: {
        primary: "Make Your Pictures",
        secondary: "Move and Smile"
      },
      subheadline: "Turn static portraits into heartwarming animations. Our AI adds natural smiles, blinks, and head movements to any photo in seconds—no download required.",
      ctaText: "Make a Photo Smile",
      trustBadge: "Pay once — no subscription",
    },
    appStoreFriction: {
      heading: "Why install another heavy app?",
      body: "Most \"face animator\" apps on the store are full of ads, require huge downloads, and drain your battery. Our web-based solution gives you the same powerful AI technology instantly in your browser. Just upload, animate, and share."
    },
    qualityAnalysis: {
      heading: "Advanced Smile Synthesis",
      subheading: "Creating a natural smile from a still photo requires deep understanding of facial anatomy.",
      features: [
        {
          title: "Natural Expression Mapping",
          description: "Our AI maps the facial landmarks of your photo and gently morphs them to create a realistic smile, ensuring the eyes crinkle and the cheeks lift just like in real life."
        },
        {
          title: "Motion Smoothing",
          description: "We use advanced interpolation to ensure the movement is fluid and natural, avoiding the \"robotic\" or \"uncanny valley\" look of cheaper apps."
        },
        {
          title: "Multi-Face Support",
          description: "Have a group photo? Our tool can detect and animate multiple faces, bringing the whole family gathering back to life."
        }
      ],
      visuals: {
        inputs: [
          { src: "/historical-wedding-photo.webp", label: "blurred wedding photo" }
        ],
        output: { src: "/historical-wedding-photo-colorized.webp", label: "sharpened and enhanced wedding photo" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Serious",
        afterLabel: "Smiling",
        caption: "A stern grandfather's portrait softened with a warm, welcoming smile."
      },
      {
        beforeLabel: "Still",
        afterLabel: "Moving",
        caption: "Subtle head movements make the subject feel present and alive."
      }
    ],
    howItWorks: {
      heading: "How to Make Your Old Photos Move",
      subheading: "It's easier than taking a selfie.",
      steps: [
        {
          step: 1,
          title: "Select a Photo",
          description: "Choose any portrait from your device. Works best with clear, front-facing faces."
        },
        {
          step: 2,
          title: "Apply the Magic",
          description: "Our AI automatically detects the face and applies the animation. You can choose different \"moods\" or movements."
        },
        {
          step: 3,
          title: "Download & Share",
          description: "Save the result as a video or GIF and surprise your friends and family."
        }
      ]
    },
    benefits: {
      heading: "Why People Love This App",
      subheading: "Join thousands who are rediscovering their photo albums.",
      items: [
        {
          title: "Viral Reactions",
          description: "These animations are perfect for TikTok and Instagram Reels. Capture your family's reaction to seeing an ancestor smile!",
          icon: "Zap"
        },
        {
          title: "Reconnect with the Past",
          description: "Seeing a great-grandparent smile for the first time creates a powerful emotional connection across generations.",
          icon: "Heart"
        },
        {
          title: "Zero Storage Used",
          description: "Since it's a web app, you save precious space on your phone for more photos.",
          icon: "Cloud"
        }
      ]
    },
    faq: [
      {
        question: "Is there an app that makes pictures move and smile?",
        answer: "Yes, BringBack AI is a leading web application that does exactly that. It uses advanced artificial intelligence to animate static photos, adding realistic smiles and head movements."
      },
      {
        question: "How do I make old photos come to life online?",
        answer: "Simply upload your photo to our online tool. Our AI will instantly animate the photo, adding a natural smile and head movements."
      },
      {
        question: "How is BringBack different from basic face animation tools?",
        answer: "BringBack is built for old and sentimental photos where quality matters. It focuses on natural expressions, smoother motion, and better handling of vintage or imperfect images instead of quick novelty effects."
      },
      {
        question: "Is this a premium service or a free trial app?",
        answer: "BringBack is a premium paid service. It is designed for users who want dependable, high-quality outputs for meaningful photos rather than ad-heavy trial-style experiences."
      },
      {
        question: "Can I use it for client work or memorial projects?",
        answer: "Yes. Many users apply it to family documentaries, tribute videos, and professional storytelling where realistic output quality is more important than one-tap filters."
      },
      {
        question: "Can I use this on my PC?",
        answer: "Yes! Unlike mobile-only apps, our platform works seamlessly on desktops, laptops, tablets, and phones."
      }
    ]
  },
  "animate-old-photos": {
    slug: "/app/animate-old-photos",
    meta: {
      title: "Best App for Animating Old Photos | AI Photo Animator",
      description: "Looking for the best app for animating old photos? Our AI tool brings vintage pictures to life instantly. Supports Dutch users searching for 'ai app om fotos te laten bewegen'.",
      keywords: [
        "best app for animating old photos",
        "app to animate old photos",
        "ai app om fotos te laten bewegen",
        "animate old photos online",
        "old photo animator",
        "bring vintage photos to life"
      ],
    },
    hero: {
      h1: "The Best App for Animating Old Photos Instantly",
      heading: {
        primary: "Animate Old Photos",
        secondary: "With AI Magic"
      },
      subheadline: "Turn dusty albums into moving memories. Our top-rated web app restores and animates vintage photography with stunning realism.",
      ctaText: "Animate Photo Now",
      trustBadge: "Rated #1 for Realism",
    },
    appStoreFriction: {
      heading: "Skip the App Store Search",
      body: "Why download a 300MB app for a single task? Our cloud-based solution offers superior processing power compared to local phone apps, delivering higher quality animations without clogging your device."
    },
    qualityAnalysis: {
      heading: "State-of-the-Art Restoration & Animation",
      subheading: "We combine restoration with animation for the best possible results.",
      features: [
        {
          title: "Dual-Stage Processing",
          description: "First, we clean up scratches, tears, and noise from your old photo. Then, we apply the animation layer, ensuring a crisp, clear moving image."
        },
        {
          title: "Global Language Support",
          description: "Whether you're searching for an 'app to animate photos' in English or an 'ai app om fotos te laten bewegen' in Dutch, our tool is optimized for users worldwide with intuitive controls."
        },
        {
          title: "HD Output",
          description: "Export your animations in high-definition video formats suitable for large screens, not just small phone displays."
        }
      ],
      visuals: {
        inputs: [
          { src: "/childhood-memories-black-and-white.webp", label: "Vintage Original" }
        ],
        output: { src: "/videos/blink-tilt-animation.mp4", label: "Restored & Animated" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Damaged",
        afterLabel: "Restored & Moving",
        caption: "Even photos with scratches can be brought back to life."
      },
      {
        beforeLabel: "Sepia",
        afterLabel: "Full Color Motion",
        caption: "Experience the past in full color and motion."
      }
    ],
    howItWorks: {
      heading: "How to Animate Old Photos in Seconds",
      subheading: "No technical skills required.",
      steps: [
        {
          step: 1,
          title: "Digitize Your Photo",
          description: "Scan your photo or take a high-quality picture of it with your phone."
        },
        {
          step: 2,
          title: "Upload to Web App",
          description: "Use our secure uploader. We accept JPG, PNG, and WebP formats."
        },
        {
          step: 3,
          title: "Download the Memory",
          description: "Receive your animated video instantly and share it with loved ones."
        }
      ]
    },
    benefits: {
      heading: "Why Choose Our Web App?",
      subheading: "The smart choice for photo animation.",
      items: [
        {
          title: "International Friendly",
          description: "We support users globally. 'AI app om fotos te laten bewegen' - wij helpen je graag!",
          icon: "Globe"
        },
        {
          title: "Privacy Guaranteed",
          description: "We don't store your photos forever. Auto-deletion ensures your memories stay private.",
          icon: "Shield"
        },
        {
          title: "Transparent Paid Credits",
          description: "Pay for the processing you use with clear pricing, built for users who need reliable premium output quality.",
          icon: "Wallet"
        }
      ]
    },
    faq: [
      {
        question: "What is the best app for animating old photos?",
        answer: "A top solution should restore image quality before animation, then generate natural motion. BringBack is designed around that full workflow, so old photos look cleaner and more lifelike in the final result."
      },
      {
        question: "How does BringBack compare with free old photo animator apps?",
        answer: "Free tools often prioritize speed and effects, while BringBack prioritizes restoration detail, realistic movement, and stable output quality for sentimental family photos."
      },
      {
        question: "Is BringBack premium-only or does it have a free trial?",
        answer: "BringBack is premium-only. It is a paid AI service built for users who need dependable quality for restoration and animation projects."
      },
      {
        question: "Can I animate damaged photos without editing them first elsewhere?",
        answer: "Yes. BringBack is built to handle restoration and animation together, so you can upload an old damaged photo and process it in one place."
      },
      {
        question: "Is this better than standard video editing apps for old photos?",
        answer: "For old-photo restoration and lifelike face motion, yes. Standard editors are general-purpose, while BringBack is specialized for vintage-photo repair plus realistic AI animation."
      },
    ]
  },
  "sharpen-wedding-photos": {
    slug: "/app/sharpen-wedding-photos",
    meta: {
      title: "Simple Steps to Sharpen Old Wedding Photos on Mobile",
      description: "Learn simple steps to sharpen old wedding photos on mobile. Our AI app restores clarity, details, and color to cherished wedding memories instantly.",
      keywords: [
        "sharpen wedding photos app",
        "fix blurry wedding photos",
        "enhance wedding pictures",
        "restore wedding photos app",
        "wedding photo sharpener",
        "clarify old photos app"
      ],
    },
    hero: {
      h1: "Sharpen Old Wedding Photos Instantly on Mobile",
      heading: {
        primary: "Sharpen Wedding Photos",
        secondary: "Relive the Special Day"
      },
      subheadline: "Don't let blurriness fade your most precious memories. Our AI sharpens faces, enhances details, and restores the magic of your wedding day photos.",
      ctaText: "Sharpen Wedding Photo instantly",
      trustBadge: "Wedding Photographer Approved",
    },
    appStoreFriction: {
      heading: "Better Than a Filter",
      body: "Standard phone filters just increase contrast. Our AI actually reconstructs missing details in faces and textures, making it the superior choice for restoring important wedding photography directly from your browser."
    },
    qualityAnalysis: {
      heading: "Professional Restoration Quality",
      subheading: "Wedding photos deserve special care. Our AI is trained to handle intricate details like lace, veils, and tuxedos.",
      features: [
        {
          title: "Face Recovery",
          description: "We specialize in recovering faces in group shots or distance shots, ensuring the bride and groom look crisp and clear."
        },
        {
          title: "Texture Enhancement",
          description: "Our AI brings back the texture of the wedding dress, the flowers, and the venue, removing the 'soft' look of old film scans."
        },
        {
          title: "Color Correction",
          description: "Fix yellowing or fading common in old wedding albums. We restore the true white of the dress and the natural skin tones."
        }
      ],
      visuals: {
        inputs: [
          { src: "/historical-wedding-photo.webp", label: "Blurry Original" }
        ],
        output: { src: "/historical-wedding-photo-colorized.webp", label: "Sharpened Result" }
      }
    },
    showcaseCaptions: [
      {
        beforeLabel: "Blurry",
        afterLabel: "Sharp",
        caption: "The bride's smile, once lost to blur, is now crystal clear."
      },
      {
        beforeLabel: "Faded",
        afterLabel: "Vibrant",
        caption: "The colors of the bouquet are restored to their original vibrancy."
      }
    ],
    howItWorks: {
      heading: "Simple Steps to Sharpen Wedding Photos on Mobile",
      subheading: "Restore your album in minutes.",
      steps: [
        {
          step: 1,
          title: "Snap or Scan",
          description: "Take a photo of the wedding picture with your phone, or scan it for best results."
        },
        {
          step: 2,
          title: "Upload to Enhance",
          description: "Upload the image to our secure tool. Our AI will automatically detect blur and fix it."
        },
        {
          step: 3,
          title: "Save & Print",
          description: "Download the high-resolution version. It's now ready to be reprinted and framed."
        }
      ]
    },
    benefits: {
      heading: "Why Restore Wedding Photos?",
      subheading: "A gift for generations.",
      items: [
        {
          title: "Anniversary Gift",
          description: "A restored wedding photo makes the perfect 50th anniversary gift for parents or grandparents.",
          icon: "Gift"
        },
        {
          title: "Family History",
          description: "Ensure future generations can see the start of your family's journey clearly.",
          icon: "History"
        },
        {
          title: "Print Ready",
          description: "Our sharpening allows you to print old photos at larger sizes without pixelation.",
          icon: "Printer"
        }
      ]
    },
    faq: [
      {
        question: "How can I sharpen old wedding photos on my phone?",
        answer: "Use BringBack AI's web app. It's designed for mobile browsers, allowing you to upload and sharpen photos directly from your camera roll without installing an app."
      },
      {
        question: "Can it fix very blurry faces?",
        answer: "Yes, our Face Recovery technology is specifically designed to reconstruct facial features even in significantly blurred or out-of-focus images."
      },
      {
        question: "How does this compare to one-tap sharpen filters?",
        answer: "One-tap filters mostly increase contrast and edge halos. BringBack uses AI reconstruction aimed at recovering facial and texture detail, which is more suitable for valuable wedding memories."
      },
      {
        question: "Is this a premium restoration service?",
        answer: "Yes. BringBack is a premium paid service focused on high-quality results for important personal photos, including weddings and family archives."
      },
      {
        question: "Can I use restored wedding photos for reprints and albums?",
        answer: "Yes. Outputs are designed for practical reuse, including digital albums, framed prints, and anniversary slideshows."
      },
      {
        question: "Is it safe for private photos?",
        answer: "Your privacy is our priority. Photos are processed securely and deleted automatically. We never share your personal wedding moments."
      }
    ]
  }
};
