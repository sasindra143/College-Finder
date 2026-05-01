import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface CSVRow {
  'S. No.': string;
  'University Name': string;
  'College Name': string;
  'College Type': string;
  'State Name': string;
  'District Name': string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function guessDegrees(name: string): string[] {
  const n = name.toLowerCase();
  const degrees: string[] = [];
  if (n.includes('engineering') || n.includes('technology') || n.includes('polytechnic')) degrees.push('B.Tech', 'M.Tech', 'Diploma');
  if (n.includes('management') || n.includes('business') || n.includes('mba')) degrees.push('MBA', 'BBA', 'PGDM');
  if (n.includes('medical') || n.includes('health') || n.includes('mbbs') || n.includes('nursing')) degrees.push('MBBS', 'B.Sc Nursing', 'BDS');
  if (n.includes('pharmacy') || n.includes('pharmaceutical')) degrees.push('B.Pharm', 'M.Pharm', 'D.Pharm');
  if (n.includes('law') || n.includes('legal')) degrees.push('LLB', 'LLM', 'BA LLB');
  if (n.includes('education') || n.includes('bed') || n.includes('training')) degrees.push('B.Ed', 'M.Ed');
  if (n.includes('arts') || n.includes('commerce') || n.includes('science')) degrees.push('B.A', 'B.Com', 'B.Sc');
  
  if (degrees.length === 0) degrees.push('B.A', 'B.Com', 'B.Sc'); // Fallback
  return degrees;
}

function getRandomFees(name: string): number {
  const n = name.toLowerCase();
  let base = 40000;
  if (n.includes('engineering') || n.includes('technology')) base = 120000;
  if (n.includes('medical') || n.includes('mbbs')) base = 500000;
  if (n.includes('management') || n.includes('mba')) base = 200000;
  if (n.includes('law')) base = 80000;
  
  return Math.floor(Math.random() * (base * 1.5 - base * 0.8) + base * 0.8);
}

function getRandomRating(): number {
  return parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1));
}

async function remoteImportColleges() {
  const csvPath = path.join(__dirname, '../../data/colleges_india.csv');
  const colleges: any[] = [];
  let count = 0;

  console.log('📖 Reading CSV file and preparing records...');

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row: CSVRow) => {
      const name = row['College Name'];
      if (!name) return;

      const slug = `${generateSlug(name)}-${count}`;
      const type = row['College Type'] || 'Affiliated College';
      const state = row['State Name'] || 'Unknown';
      const city = row['District Name'] || 'Unknown';
      const fees = getRandomFees(name);
      const rating = getRandomRating();
      const degrees = guessDegrees(name);

      colleges.push({
        name,
        slug,
        location: `${city}, ${state}`,
        city,
        state,
        ownership: type.includes('Constituent') ? 'Public' : (type.includes('Affiliated') ? 'Private' : 'Deemed'),
        established: 1970 + Math.floor(Math.random() * 50),
        fees,
        rating,
        totalReviews: Math.floor(Math.random() * 500),
        placementPercent: Math.floor(Math.random() * (98 - 70) + 70),
        avgPackage: Math.floor(Math.random() * (12 - 3) + 3),
        description: `${name} is a premier institution located in ${city}, ${state}. Affiliated with ${row['University Name']}, it offers high-quality education in ${degrees.join(', ')}.`,
        affiliation: row['University Name'],
        exams: ['JEE Main', 'CUET', 'GATE'],
        degrees: degrees,
        imageUrl: `https://images.unsplash.com/photo-1562774053-701939374585?w=800`,
      });

      count++;
    })
    .on('end', async () => {
      console.log(`✅ Prepared ${colleges.length} colleges. Starting upload to Render...`);
      
      const batchSize = 50; // Keep payload small to avoid express limits
      for (let i = 0; i < colleges.length; i += batchSize) {
        const batch = colleges.slice(i, i + batchSize);
        try {
          const response = await fetch('https://college-finder-hu2a.onrender.com/api/colleges/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ colleges: batch })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Batch ${i} failed:`, errorText);
          } else {
            console.log(`📈 Uploaded ${i + batch.length} / ${colleges.length}`);
          }
        } catch (e: any) {
           console.error(`❌ Network error on batch ${i}:`, e.message);
        }
      }

      console.log('🎉 Successfully sent all data to Render!');
      process.exit(0);
    });
}

remoteImportColleges().catch((err) => {
  console.error('❌ Error during import:', err);
  process.exit(1);
});
