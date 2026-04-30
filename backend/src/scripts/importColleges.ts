import csv from 'csvtojson';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importData() {
  const filePath = 'data/colleges_india.csv';

  console.log('Loading CSV data...');
  const colleges = await csv().fromFile(filePath);

  console.log(`Found ${colleges.length} colleges. Formatting...`);

  const formatted = colleges.map((c: any) => {
    const rawName = c['College Name'] || c['Name'] || c['3'];
    let name = rawName || 'Unknown College';
    if (name.includes('(Id:')) {
      name = name.split('(Id:')[0].trim();
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000000);
    
    const district = c['District Name'] || c['District'] || c['5'] || 'Unknown';
    const state = c['State Name'] || c['State'] || c['4'] || 'Unknown';

    return {
      name,
      state,
      city: district,
      location: `${district}, ${state}`,
      slug,
      ownership: c['College Type'] || c['3'] || 'Private',
      established: Math.floor(Math.random() * 50) + 1970,
      fees: Math.floor(Math.random() * 500000) + 50000,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      description: `A premier educational institution located in ${district}, ${state}.`,
      website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.edu.in`
    };
  });

  console.log('Importing into database in chunks...');
  const CHUNK_SIZE = 5000;
  for (let i = 0; i < formatted.length; i += CHUNK_SIZE) {
    const chunk = formatted.slice(i, i + CHUNK_SIZE);
    await prisma.college.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`Imported ${Math.min(i + CHUNK_SIZE, formatted.length)} / ${formatted.length}`);
  }

  console.log('✅ Colleges imported successfully');
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
