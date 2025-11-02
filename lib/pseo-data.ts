// /lib/pseo-data.ts

// CATEGORY 1: The Problem
export const problems = [
  { 
    slug: 'faded', 
    name: 'Faded', 
    h1_fragment: 'Faded Photo',
    description: 'Time and sunlight make colors lose their vibrancy. Our AI restores the original contrast, saturation, and color balance to make your photos pop again.' 
  },
  { 
    slug: 'scratched', 
    name: 'Scratched',
    h1_fragment: 'Scratched Photo',
    description: 'Scratches, dust, and creases can ruin a perfect memory. BringBack.pro intelligently identifies and removes these imperfections, leaving a clean, smooth image.'
  },
  { 
    slug: 'blurry', 
    name: 'Blurry',
    h1_fragment: 'Blurry Photo',
    description: 'Out-of-focus or shaky photos are hard to look at. Our AI unblurs images, sharpens details, and enhances faces to bring stunning clarity to your pictures.'
  },
  { 
    slug: 'water-damaged', 
    name: 'Water-Damaged',
    h1_fragment: 'Water-Damaged',
    description: 'Water stains, mold, or spots can seem impossible to fix. Our AI is trained to detect and remove these blemishes, restoring the photo underneath.'
  },
  { 
    slug: 'torn', 
    name: 'Torn or Ripped',
    h1_fragment: 'Torn Photo',
    description: 'Photos torn in half or missing pieces can be digitally reconstructed. Our AI uses surrounding pixels to intelligently fill in and repair the damaged areas.'
  },
  {
    name: 'Yellowed',
    slug: 'yellowed',
    h1_fragment: 'Yellowed',
    description: 'Yellowing happens over time due to acid in the paper or exposure to sunlight. It can make a photo look dull and aged.'
  },
  {
    name: 'Moldy',
    slug: 'moldy',
    h1_fragment: 'Moldy',
    description: 'Mold damage can appear as black, green, or white spots on a photo, often caused by high humidity. It can eat away at the image over time.'
  },
  {
    name: 'Creased',
    slug: 'creased',
    h1_fragment: 'Creased',
    description: 'Creases are sharp folds in a photo that can break the emulsion and cause permanent damage to the image.'
  },
  {
    name: 'Stained',
    slug: 'stained',
    h1_fragment: 'Stained',
    description: 'Stains from water, coffee, or other liquids can discolor a photo and obscure important details.'
  },
  {
    name: 'Dusty',
    slug: 'dusty',
    h1_fragment: 'Dusty',
    description: 'Dust and debris can accumulate on the surface of a photo, making it look dirty and obscuring the image.'
  },
  {
    name: 'Low-Resolution',
    slug: 'low-resolution',
    h1_fragment: 'Low-Resolution',
    description: 'Low-resolution photos lack detail and appear pixelated, especially when enlarged. This is common with old digital photos or scans.'
  }
];

// CATEGORY 2: The Subject / Type
export const photoTypes = [
  { 
    slug: 'family-portrait', 
    name: 'Family Portrait',
    h1_fragment: 'Family Portrait',
    description: 'Your family portraits are irreplaceable. Whether it\'s a group shot from the 70s or a photo of your grandparents, we ensure every face is clear and vibrant.'
  },
  { 
    slug: 'wedding-photo', 
    name: 'Wedding Photo',
    h1_fragment: 'Wedding Photo',
    description: 'Don\'t let a damaged photo ruin your wedding memories. We specialize in restoring bridal portraits, group shots, and candid moments from your special day.'
  },
  { 
    slug: 'childhood-photo', 
    name: 'Childhood Photo',
    h1_fragment: 'Childhood Photo',
    description: 'Those priceless childhood photos deserve to be preserved. We can fix the damage and even enhance the details to bring those memories back to life.'
  },
  { 
    slug: 'military-photo', 
    name: 'Military Photo',
    h1_fragment: 'Military Photo',
    description: 'Photos of ancestors in uniform are a vital link to your family\'s history. We restore military portraits with the respect and clarity they deserve.'
  },
  {
    name: 'Ancestor Photo',
    h1_fragment: 'Ancestor Photo',
    slug: 'ancestor-photo',
    description: 'Photos of our ancestors connect us to our roots. Restoring them helps preserve family history for future generations.'
  },
  {
    name: 'Baby Photo',
    h1_fragment: 'Baby Photo',
    slug: 'baby-photo',
    description: 'Baby photos capture a fleeting moment in time. Restoring them allows you to relive those precious early memories.'
  },
  {
    name: 'Graduation Photo',
    h1_fragment: 'Graduation Photo',
    slug: 'graduation-photo',
    description: 'Graduation photos celebrate a major life achievement. Restoring them ensures that this milestone is never forgotten.'
  },
  {
    name: 'Holiday Snap',
    h1_fragment: 'Holiday Snap',
    slug: 'holiday-snap',
    description: 'Holiday snaps are full of happy memories. Restoring them brings back the joy of those special times with family and friends.'
  }
  // ... (add 'ancestor', 'baby-photo', 'graduation-photo', 'holiday-snap')
];

// CATEGORY 3: The Action (This is a different set of pages)
export const actions = [
  {
    slug: 'colorize-black-and-white',
    name: 'Colorize',
    h1: 'AI Photo Colorizer',
    metaTitle: 'Colorize Black and White Photos Online | BringBack.pro',
    metaDescription: 'Bring your black and white photos to life. Our AI adds realistic, natural color to your old family, history, and ancestor photos in seconds.',
    problemText: 'Black and white photos capture a moment, but color brings it to life. Seeing an old photo in color for the first time is a magical experience.',
    solutionText: 'Our AI has studied millions of photos to learn how to apply realistic color. It understands the difference between a sky, a face, and a fabric, ensuring the tones are natural and vibrant.'
  },
  {
    slug: 'animate-old-photos',
    name: 'Animate',
    h1: 'Animate Old Photos with AI',
    metaTitle: 'AI Photo Animator | BringBack.pro',
    metaDescription: 'Turn any old portrait into a living memory. Our AI animates faces in your old photos, making it look like your ancestors are smiling right at you.',
    problemText: 'A still photo is a captured moment. But what if you could see that person smile, blink, and turn their head? It creates a powerful, emotional connection.',
    solutionText: 'Using sophisticated AI, we create a short, "live" video from your still portrait. It\'s the perfect way to see your family and ancestors in a completely new light.'
  },
  {
    name: 'Enhance Photo Quality',
    slug: 'enhance-photo-quality',
    h1: 'Enhance Photo Quality',
    metaTitle: 'Enhance Photo Quality - Restore Photo Online',
    metaDescription: 'Improve the overall quality of your photos with our AI-powered enhancement tool. Increase resolution, reduce noise, and improve colors.',
    problemText: 'Your photos may look dull, grainy, or lack detail. This can be due to a variety of factors, including the quality of the camera or the age of the photo.',
    solutionText: 'Our AI can enhance the quality of your photos by increasing the resolution, reducing noise, and improving the colors. The result is a sharper, more vibrant image.',
  }
  // ... (add 'unblur-faces', 'enhance-photo-quality')
];

// --- General FAQs ---
export const generalFaqs = [
  {
    question: "How much does it cost to restore an old photo?",
    answer: "Our photo restoration service is incredibly affordable. You can restore 5 photos for just $2 USD. This includes commercial usage rights and a 30-day money-back guarantee. You get high-quality results without the professional price tag."
  },
  {
    question: "How fast is the BringBack.pro AI restoration process?",
    answer: "Our service is built for speed. Once uploaded, most photos are fully restored, fixed, and ready to download in under 30 seconds. No waiting days for a human retoucher."
  },
  {
    question: "Is my photo safe and private?",
    answer: "Absolutely. We are privacy-first. All uploaded images are processed securely and deleted from our servers automatically after the restoration is complete, typically within 7 days. Your memories stay yours."
  },
  {
    question: "Can I print the restored photos?",
    answer: "Yes. Our AI not only fixes the damage but also upscales and enhances the image quality, delivering a high-resolution, print-ready file (usually JPG or PNG) perfect for framing or albums."
  },
];

export const restorationKeywords = [
  { keyword: 'Best photo restoration app', slug: 'best-photo-restoration-app' },
  { keyword: 'Photo restoration app free', slug: 'photo-restoration-app-free' },
  { keyword: 'AI old photo restoration online free', slug: 'ai-old-photo-restoration-online-free' },
  { keyword: 'Restore old damaged photos', slug: 'restore-old-damaged-photos' },
  { keyword: 'ChatGPT photo restoration', slug: 'chatgpt-photo-restoration' },
  { keyword: 'Enhance old photo', slug: 'enhance-old-photo' },
  { keyword: 'Old photo restoration ai tools free', slug: 'old-photo-restoration-ai-tools-free' },
  { keyword: 'Old photo restoration online free', slug: 'old-photo-restoration-online-free' },
  { keyword: 'AI photo restoration online free', slug: 'ai-photo-restoration-online-free' },
  { keyword: 'Old photo color restoration online free', slug: 'old-photo-color-restoration-online-free' },
  { keyword: 'Best old photo restoration ai tools', slug: 'best-old-photo-restoration-ai-tools' },
  { keyword: 'Nero AI Photo Restoration', slug: 'nero-ai-photo-restoration' },
  { keyword: 'Best AI photo restoration', slug: 'best-ai-photo-restoration' },
  { keyword: 'Old photo restoration prompt', slug: 'old-photo-restoration-prompt' },
];

export const howToKeywords = [
  { keyword: 'how to clean old pictures', slug: 'how-to-clean-old-pictures' },
  { keyword: 'how to clean pictures', slug: 'how-to-clean-pictures' },
  { keyword: 'how to clean old photos', slug: 'how-to-clean-old-photos' },
  { keyword: 'cleaning photographs', slug: 'cleaning-photographs' },
  { keyword: 'how do you clean a photograph', slug: 'how-do-you-clean-a-photograph' },
  { keyword: 'what cleans a professional photograph', slug: 'what-cleans-a-professional-photograph' },
  { keyword: 'how to remove scratches from old photos', slug: 'how-to-remove-scratches-from-old-photos' },
  { keyword: 'remove scratches from pictures', slug: 'remove-scratches-from-pictures' },
  { keyword: 'remove scratches from photo', slug: 'remove-scratches-from-photo' },
  { keyword: 'graininess in photos', slug: 'graininess-in-photos' },
  { keyword: 'how to fix grainy images', slug: 'how-to-fix-grainy-images' },
  { keyword: 'how to fix grainy pictures', slug: 'how-to-fix-grainy-pictures' },
  { keyword: 'how to fix grainy photos', slug: 'how-to-fix-grainy-photos' },
];

export const digitizationKeywords = [
  { keyword: 'where can i scan photos', slug: 'where-can-i-scan-photos' },
  { keyword: 'digitising photographs', slug: 'digitising-photographs' },
  { keyword: 'how to scan photographs', slug: 'how-to-scan-photographs' },
  { keyword: 'how to digitize photos', slug: 'how-to-digitize-photos' },
  { keyword: 'how to scan old photos for the best resolution', slug: 'how-to-scan-old-photos-for-the-best-resolution' },
  { keyword: 'scan photos to digital', slug: 'scan-photos-to-digital' },
  { keyword: 'scanning old photographs', slug: 'scanning-old-photographs' },
  { keyword: 'where to scan photos', slug: 'where-to-scan-photos' },
  { keyword: 'scanner for scanning photos', slug: 'scanner-for-scanning-photos' },
  { keyword: 'best way to digitize photos', slug: 'best-way-to-digitize-photos' },
  { keyword: 'how to digitise photos', slug: 'how-to-digitise-photos' },
  { keyword: 'how to scan old pictures', slug: 'how-to-scan-old-pictures' },
  { keyword: 'how to digitize pictures', slug: 'how-to-digitize-pictures' },
  { keyword: 'where can i get a photo digitized', slug: 'where-can-i-get-a-photo-digitized' },
  { keyword: 'convert photos to digital at home', slug: 'convert-photos-to-digital-at-home' },
  { keyword: 'how can i digitize old photos', slug: 'how-can-i-digitize-old-photos' },
  { keyword: 'where to get photos scanned', slug: 'where-to-get-photos-scanned' },
  { keyword: 'where can i get photos scanned', slug: 'where-can-i-get-photos-scanned' },
  { keyword: 'convert photographs to digital', slug: 'convert-photographs-to-digital' },
  { keyword: 'best photo scanner for old photos', slug: 'best-photo-scanner-for-old-photos' },
  { keyword: 'how to scan pictures', slug: 'how-to-scan-pictures' },
  { keyword: 'best photo scanner for old pictures', slug: 'best-photo-scanner-for-old-pictures' },
  { keyword: 'photographs to digital', slug: 'photographs-to-digital' },
  { keyword: 'convert pictures to digital', slug: 'convert-pictures-to-digital' },
  { keyword: 'how do i digitise old photos', slug: 'how-do-i-digitise-old-photos' },
  { keyword: 'best way to scan photos', slug: 'best-way-to-scan-photos' },
  { keyword: 'best scanner old photos', slug: 'best-scanner-old-photos' },
  { keyword: 'how to digitize old photographs', slug: 'how-to-digitize-old-photographs' },
  { keyword: 'how do i digitize old photos', slug: 'how-do-i-digitize-old-photos' },
  { keyword: 'copy old photos', slug: 'copy-old-photos' },
];