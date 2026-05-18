import fs from 'fs';
import path from 'path';

// Need to import the data to check
// Since this is a TS project, we can run this script with `npx tsx check_urls.ts`
import { allPseoPages } from './lib/generate-pages';
import { featuresData } from './lib/featuresdata';
import { countryPages } from './lib/countrypages';
import { appData } from './lib/appdata';

const baseUrl = 'https://bringback.pro';

// Build a set of all valid URLs
const validUrls = new Set<string>();

// Static pages (from sitemap.ts)
const staticPaths = [
  '', '/blog', '/pricing', '/login', '/privacy', '/terms', '/refunds', 
  '/denoise-photos', '/colorize-photos', '/examples', '/ai-photo-animation', 
  '/ai-family-portrait', '/old-photo-restoration', '/referral'
];
staticPaths.forEach(p => validUrls.add(`${baseUrl}${p}`));

// PSEO pages
allPseoPages.forEach(page => {
  validUrls.add(`${baseUrl}/restore/${page.slug}`);
});

// Features pages
Object.values(featuresData).forEach(page => {
  validUrls.add(`${baseUrl}${page.slug}`);
});

// Country pages
Object.values(countryPages).forEach(page => {
  validUrls.add(`${baseUrl}${page.slug}`);
});

// App pages
Object.values(appData).forEach(page => {
  validUrls.add(`${baseUrl}${page.slug}`);
});

// Read data.md
const dataMdPath = path.join(__dirname, 'data.md');
const content = fs.readFileSync(dataMdPath, 'utf8');
const lines = content.split('\n');

const updatedLines = [];
let keptCount = 0;
let deletedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (i === 0) {
    updatedLines.push(line); // Header
    continue;
  }
  if (!line) {
    updatedLines.push(line);
    continue;
  }
  
  const parts = line.split(',');
  const url = parts[0];
  
  if (url.startsWith('http')) {
    if (validUrls.has(url)) {
      updatedLines.push(line);
      keptCount++;
    } else {
      deletedCount++;
      console.log(`Deleted: ${url}`);
    }
  } else {
    // If it's just a date or empty, skip or keep depending on the line
    // Look at line 6: "2026-04-09" - clearly a malformed line
    deletedCount++;
  }
}

fs.writeFileSync(dataMdPath, updatedLines.join('\n'), 'utf8');

console.log(`\nResults:`);
console.log(`Kept: ${keptCount}`);
console.log(`Deleted/Excluded: ${deletedCount}`);
