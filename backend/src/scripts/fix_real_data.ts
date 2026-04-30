import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DATA_FIXES = [
  { name: 'Indian Institute of Science (IISc)', website: 'https://iisc.ac.in', ownership: 'Public/Government', city: 'Bangalore' },
  { name: 'National Institute of Technology Karnataka (NITK)', website: 'https://www.nitk.ac.in', ownership: 'Public/Government', city: 'Surathkal' },
  { name: 'Jamia Millia Islamia', website: 'https://www.jmi.ac.in', ownership: 'Public/Government', city: 'New Delhi' },
  { name: 'University of Delhi (DU)', website: 'https://du.ac.in', ownership: 'Public/Government', city: 'New Delhi' },
  { name: 'Anna University', website: 'https://www.annauniv.edu', ownership: 'Public/Government', city: 'Chennai' },
  { name: 'Banaras Hindu University (BHU)', website: 'https://www.bhu.ac.in', ownership: 'Public/Government', city: 'Varanasi' },
  { name: 'IIT Tirupati', website: 'https://iittp.ac.in', ownership: 'Public/Government', city: 'Tirupati' },
  { name: 'RV College of Engineering', website: 'https://www.rvce.edu.in', ownership: 'Private', city: 'Bangalore' },
  { name: 'BMS College of Engineering', website: 'https://www.bmsce.ac.in', ownership: 'Private', city: 'Bangalore' },
  { name: 'MS Ramaiah Institute of Technology', website: 'https://www.msrit.edu', ownership: 'Private', city: 'Bangalore' },
  { name: 'PES University', website: 'https://pes.edu', ownership: 'Private', city: 'Bangalore' },
  { name: 'Dayananda Sagar College of Engineering', website: 'https://www.dsce.edu.in', ownership: 'Private', city: 'Bangalore' },
  { name: 'Bangalore Institute of Technology', website: 'https://bit-bangalore.edu.in', ownership: 'Private', city: 'Bangalore' }
];

async function main() {
  console.log('🛠️ Fixing Real Data Fields (Robust Version)...');
  
  for (const fix of DATA_FIXES) {
    const slug = fix.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    await prisma.college.upsert({
      where: { slug },
      update: {
        website: fix.website,
        ownership: fix.ownership,
        city: fix.city
      },
      create: {
        name: fix.name,
        slug,
        location: `${fix.city}, Unknown`,
        city: fix.city,
        state: 'Unknown',
        ownership: fix.ownership,
        established: 1950,
        fees: 50000,
        rating: 4.5,
        website: fix.website,
        description: `${fix.name} is a premier institution.`,
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'
      }
    });
    console.log(`✅ Upserted: ${fix.name}`);
  }

  console.log('🎉 Data fix complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
