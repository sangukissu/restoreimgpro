const fs = require('fs');
const config = fs.readFileSync('next.config.js', 'utf8');

const deletedSlugs = [
  'fix-scratched-childhood-photo',
  'how-can-i-digitize-old-photos',
  'fix-low-resolution-military-photo',
  'best-way-to-scan-photos',
  'fix-yellowed-family-portrait',
  'remove-scratches-from-pictures',
  'fix-creased-ancestor-photo',
  'fix-blurry-graduation-photo',
  'fix-water-damaged-ancestor-photo',
  'convert-pictures-to-digital',
  'fix-yellowed-graduation-photo',
  'fix-blurry-ancestor-photo',
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
  'fix-faded-ancestor-photo',
  'fix-faded-baby-photo',
  'fix-scratched-family-portrait',
  'old-photo-color-restoration-online',
  'fix-yellowed-military-photo',
  'fix-scratched-graduation-photo',
  'fix-scratched-wedding-photo',
  'fix-water-damaged-wedding-photo',
  'fix-dusty-baby-photo'
];

let redirects = '';
for (const slug of deletedSlugs) {
  let dest = '/old-photo-restoration';
  if (slug === 'colorize-black-and-white' || slug === 'old-photo-color-restoration-online') dest = '/colorize-photos';
  if (slug === 'enhance-photo-quality') dest = '/denoise-photos';
  
  redirects += `      {
        source: '/restore/${slug}',
        destination: '${dest}',
        permanent: true
      },\n`;
}

const regex = /source: '\/restore\/animate-old-photos',[\s\S]*?permanent: true\n      },/;
const newConfig = config.replace(regex, `source: '/restore/animate-old-photos',
        destination: '/ai-photo-animation',
        permanent: true
      },
${redirects.trimEnd()}`);

fs.writeFileSync('next.config.js', newConfig);
console.log('Updated next.config.js');
