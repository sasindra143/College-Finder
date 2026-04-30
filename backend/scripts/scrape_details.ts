import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeCollegeDetails(page: any, collegeName: string) {
  try {
    // 1. Search for the college on Google targeting careers360
    const query = encodeURIComponent(`${collegeName} careers360`);
    await page.goto(`https://www.google.com/search?q=${query}`);
    await delay(2000);

    // 2. Click the first careers360 link
    const searchResults = await page.$$('a');
    let targetUrl = null;
    for (const link of searchResults) {
      const href = await page.evaluate((el: any) => el.href, link);
      if (href && href.includes('careers360.com/colleges/')) {
        targetUrl = href;
        break;
      }
    }

    if (!targetUrl) {
      console.log(`❌ No Careers360 link found for ${collegeName}`);
      return null;
    }

    console.log(`🔗 Found Profile: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await delay(3000); // Wait for dynamic content

    // 3. Extract Data (These selectors are examples and may need adjustment based on site updates)
    const scrapedData = await page.evaluate(() => {
      const data: any = {};
      
      // Extract Description
      const descEl = document.querySelector('.about_college_sec p');
      if (descEl) data.description = descEl.textContent?.trim();

      // Extract Ratings
      const ratingEl = document.querySelector('.rating_block span');
      if (ratingEl) data.rating = parseFloat(ratingEl.textContent || '0');

      // Extract Fees / Packages (Looking for quick facts/highlights)
      const highlightBoxes = document.querySelectorAll('.highlights_box');
      highlightBoxes.forEach((box: any) => {
        const text = box.textContent?.toLowerCase() || '';
        if (text.includes('fee')) data.feesText = text;
        if (text.includes('package') || text.includes('salary')) data.placementText = text;
      });

      return data;
    });

    return scrapedData;

  } catch (err: any) {
    console.error(`Error scraping ${collegeName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Deep Scrape for College Details...');
  
  // Launch Puppeteer (Headless mode false if you want to see it work and bypass captchas manually)
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  // Get top colleges that still have generic descriptions
  const colleges = await prisma.college.findMany({
    where: { description: { contains: 'premier educational institution' } }, // Our generic placeholder
    take: 10,
    orderBy: { rating: 'desc' }
  });

  console.log(`Found ${colleges.length} colleges needing detailed data.`);

  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i];
    console.log(`\n[${i+1}/${colleges.length}] Scraping: ${college.name}`);
    
    const data = await scrapeCollegeDetails(page, college.name);
    
    if (data && data.description) {
      console.log(`✅ Extracted data successfully.`);
      
      // Update Database
      await prisma.college.update({
        where: { id: college.id },
        data: {
          description: data.description || college.description,
          rating: data.rating || college.rating,
          // Process other text into actual numbers if needed
        }
      });
      console.log(`💾 Saved to database!`);
    }

    // Crucial delay to avoid IP Ban
    const waitTime = Math.floor(Math.random() * 10000) + 10000; // 10 to 20 seconds
    console.log(`Sleeping for ${waitTime/1000} seconds to prevent bans...`);
    await delay(waitTime);
  }

  await browser.close();
  console.log('🎉 Deep scrape session complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
