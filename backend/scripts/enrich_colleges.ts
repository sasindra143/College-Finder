import { PrismaClient } from '@prisma/client';
const googleIt = require('google-it');

const prisma = new PrismaClient();

// Blacklist of aggregator sites to avoid when looking for OFFICIAL websites
const BLACKLIST = [
  'shiksha.com', 'collegedunia.com', 'careers360.com', 'wikipedia.org',
  'justdial.com', 'collegeDekho.com', 'facebook.com', 'linkedin.com',
  'instagram.com', 'twitter.com', 'youtube.com', 'getmyuni.com',
  'indiatoday.in', 'zollege.in', 'sarvgyan.com', 'collegebatch.com',
  'targetadmission.com', 'pagalguy.com', 'maps.google.com', 'admission.com'
];

function isOfficialWebsite(link: string): boolean {
  try {
    const url = new URL(link);
    const domain = url.hostname.toLowerCase();
    
    // Check against blacklist
    for (const b of BLACKLIST) {
      if (domain.includes(b.toLowerCase())) return false;
    }

    // Usually official websites in India end with .ac.in or .edu.in
    if (domain.endsWith('.ac.in') || domain.endsWith('.edu.in') || domain.endsWith('.edu') || domain.endsWith('.org') || domain.endsWith('.in')) {
        return true;
    }
    
    return true; // If not in blacklist, consider it potentially official
  } catch {
    return false;
  }
}

async function findWebsiteForCollege(name: string, city: string): Promise<string | null> {
  try {
    const query = `"${name}" ${city} official website`;
    console.log(`Searching for: ${query}`);
    
    const results = await googleIt({ query, disableConsole: true });
    
    for (const res of results) {
      if (isOfficialWebsite(res.link)) {
        return res.link;
      }
    }
    return null;
  } catch (error: any) {
    console.error(`Error searching for ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting College Enrichment Process...');
  console.log('⚠️ Note: Processing 37,000+ records will take a long time and may trigger search engine rate limits.');
  
  // Get colleges that don't have a website
  const collegesToEnrich = await prisma.college.findMany({
    where: { website: null },
    take: 100, // Process in batches to avoid overwhelming memory/limits
    orderBy: { rating: 'desc' } // Prioritize higher rated ones
  });

  console.log(`Found ${collegesToEnrich.length} colleges to enrich in this batch.`);

  let updatedCount = 0;

  for (let i = 0; i < collegesToEnrich.length; i++) {
    const college = collegesToEnrich[i];
    console.log(`\n[${i + 1}/${collegesToEnrich.length}] Processing: ${college.name} (${college.city})`);
    
    const website = await findWebsiteForCollege(college.name, college.city);
    
    if (website) {
      console.log(`✅ Found website: ${website}`);
      await prisma.college.update({
        where: { id: college.id },
        data: { website }
      });
      updatedCount++;
    } else {
      console.log(`❌ No official website found.`);
    }

    // Delay to prevent getting blocked by Google (5-10 seconds)
    const delay = Math.floor(Math.random() * 5000) + 5000;
    console.log(`Sleeping for ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  console.log(`\n🎉 Enrichment Batch Complete! Updated ${updatedCount} colleges.`);
  console.log('Run this script periodically or increase the batch size to process all 37,700 colleges.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
