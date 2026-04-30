import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CSV_FILE = path.join(__dirname, '../../data/colleges_india.csv');

async function importColleges() {
  console.log('🚀 Starting All India College Import...');
  const colleges: any[] = [];

  fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (row) => {
      // Map CSV headers to our schema
      // Headers: S. No., University Name, College Name, College Type, State Name, District Name
      const collegeName = row['College Name']?.split(' (Id:')[0]?.trim();
      const university = row['University Name']?.split(' (Id:')[0]?.trim();
      const state = row['State Name']?.trim();
      const city = row['District Name']?.trim();
      const type = row['College Type']?.trim();

      if (collegeName && state) {
        // Clean the name for slug
        const slug = (collegeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')).replace(/^-|-$/g, '') + '-' + (city || state).toLowerCase().replace(/\s+/g, '-');
        
        colleges.push({
          name: collegeName,
          slug,
          location: `${city}, ${state}`,
          city: city || 'Unknown',
          state: state,
          ownership: type === 'Government' ? 'Public/Government' : 'Private',
          affiliation: university,
          established: 2000, // Default for mass import
          fees: 45000,
          rating: 4.0,
          description: `${collegeName} is an institution affiliated with ${university} in ${city}, ${state}.`,
          imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'
        });
      }
    })
    .on('end', async () => {
      console.log(`📦 Parsed ${colleges.length} colleges. Starting database insertion...`);
      
      // Batch processing to avoid memory/db timeouts
      const batchSize = 100;
      let count = 0;

      for (let i = 0; i < colleges.length; i += batchSize) {
        const batch = colleges.slice(i, i + batchSize);
        try {
          await Promise.all(batch.map(c => 
            prisma.college.upsert({
              where: { slug: c.slug },
              update: {},
              create: c
            })
          ));
          count += batch.length;
          if (count % 1000 === 0) console.log(`✅ Imported ${count} colleges...`);
        } catch (err) {
          console.error('Batch import error:', err);
        }
      }

      console.log(`🎉 Success! Total imported: ${count}`);
      await prisma.$disconnect();
    });
}

importColleges();
