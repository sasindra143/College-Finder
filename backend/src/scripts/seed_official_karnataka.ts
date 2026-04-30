import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const KARNATAKA_COLLEGES = [
  // Engineering
  { name: 'Indian Institute of Science', website: 'https://iisc.ac.in', ownership: 'Public/Government', city: 'Bangalore', state: 'Karnataka' },
  { name: 'National Institute of Technology Karnataka', website: 'https://www.nitk.ac.in', ownership: 'Public/Government', city: 'Surathkal', state: 'Karnataka' },
  { name: 'Indian Institute of Technology Dharwad', website: 'https://www.iitdh.ac.in', ownership: 'Public/Government', city: 'Dharwad', state: 'Karnataka' },
  { name: 'IIIT Bangalore', website: 'https://www.iiitb.ac.in', ownership: 'Deemed', city: 'Bangalore', state: 'Karnataka' },
  { name: 'RV College of Engineering', website: 'https://www.rvce.edu.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'BMS College of Engineering', website: 'https://www.bmsce.ac.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'MS Ramaiah Institute of Technology', website: 'https://www.msrit.edu', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'PES University', website: 'https://pes.edu', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'Dayananda Sagar College of Engineering', website: 'https://www.dsce.edu.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'Bangalore Institute of Technology', website: 'https://bit-bangalore.edu.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  
  // Medical
  { name: 'Bangalore Medical College and Research Institute', website: 'https://bmcri.org', ownership: 'Public/Government', city: 'Bangalore', state: 'Karnataka' },
  { name: 'St Johns Medical College', website: 'https://www.stjohns.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'Kasturba Medical College Manipal', website: 'https://manipal.edu/kmc-manipal.html', ownership: 'Private', city: 'Manipal', state: 'Karnataka' },
  { name: 'JSS Medical College', website: 'https://www.jssuni.edu.in', ownership: 'Private', city: 'Mysore', state: 'Karnataka' },
  
  // Law
  { name: 'National Law School of India University', website: 'https://www.nls.ac.in', ownership: 'Public/Government', city: 'Bangalore', state: 'Karnataka' },
  
  // Arts/Commerce
  { name: 'Christ University', website: 'https://christuniversity.in', ownership: 'Deemed', city: 'Bangalore', state: 'Karnataka' },
  { name: 'St Josephs College Bangalore', website: 'https://sjc.ac.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' },
  { name: 'Mount Carmel College', website: 'https://mccblr.edu.in', ownership: 'Private', city: 'Bangalore', state: 'Karnataka' }
];

async function main() {
  console.log('🚀 Seeding Official Karnataka Colleges Data...');
  
  for (const c of KARNATAKA_COLLEGES) {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    await prisma.college.upsert({
      where: { slug },
      update: { website: c.website },
      create: {
        name: c.name,
        slug,
        location: `${c.city}, ${c.state}`,
        city: c.city,
        state: c.state,
        ownership: c.ownership,
        established: 1950,
        fees: c.ownership === 'Public/Government' ? 30000 : 250000,
        rating: 4.5,
        placementPercent: 85,
        avgPackage: 10,
        website: c.website,
        description: `${c.name} is a premier institution located in ${c.city}, ${c.state}. Visit our official website for more details.`,
        imageUrl: `https://images.unsplash.com/photo-1562774053-701939374585?w=800`,
        courses: {
          create: [
            { name: 'Undergraduate Program', duration: '4 Years', fees: 100000, seats: 60, eligibility: '12th Pass' }
          ]
        }
      }
    });
    console.log(`✅ Seeded: ${c.name} (${c.website})`);
  }

  console.log('🎉 Official Karnataka seeding complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
