import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting to load colleges from CSV...");

  const colleges: any[] = [];
  const csvFilePath = path.join(__dirname, "../data/colleges_india.csv");

  return new Promise((resolve, reject) => {
    let index = 0;
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Row: S. No.,University Name,College Name,College Type,State Name,District Name
        const name = row["College Name"];
        if (!name) return;
        
        index++;
        const city = row["District Name"] || "Unknown";
        const state = row["State Name"] || "Unknown";
        const ownership = row["College Type"] || "Private";
        const affiliation = row["University Name"] || "";

        // Generate slug - must be unique
        const cleanName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().replace(/-+/g, "-");
        const slug = `${cleanName}-${index}`;

        // Generate realistic mock data for exams and degrees based on name heuristics
        let exams: string[] = [];
        let degrees: string[] = [];
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('technolog') || nameLower.includes('engineering') || nameLower.includes('institute of tech')) {
          exams = ['JEE Main', 'GATE', 'BITSAT', 'COMEDK', 'WBJEE'];
          degrees = ['B.Tech', 'M.Tech', 'B.E.'];
        } else if (nameLower.includes('medical') || nameLower.includes('health') || nameLower.includes('hospital')) {
          exams = ['NEET', 'NEET PG', 'AIIMS'];
          degrees = ['MBBS', 'BDS', 'B.Sc Nursing'];
        } else if (nameLower.includes('management') || nameLower.includes('business')) {
          exams = ['CAT', 'MAT', 'XAT', 'CMAT'];
          degrees = ['MBA', 'BBA', 'PGDM'];
        } else if (nameLower.includes('law') || nameLower.includes('legal')) {
          exams = ['CLAT', 'LSAT India', 'AILET'];
          degrees = ['LLB', 'BA LLB', 'LLM'];
        } else {
          // General colleges
          exams = ['CUET', 'State CET'];
          degrees = ['B.A', 'B.Sc', 'B.Com', 'M.A'];
        }

        colleges.push({
          name: name,
          slug: slug,
          location: `${city}, ${state}`,
          city: city,
          state: state,
          ownership: ownership,
          affiliation: affiliation,
          established: Math.floor(Math.random() * (2020 - 1950 + 1)) + 1950,
          fees: Math.floor(Math.random() * (300000 - 50000 + 1)) + 50000,
          rating: Number((Math.random() * (5 - 3) + 3).toFixed(1)),
          description: `${name} is a renowned ${ownership} institution affiliated with ${affiliation}. Located in ${city}, ${state}, it offers excellent academic programs.`,
          imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
          exams: exams,
          degrees: degrees
        });
      })
      .on("end", async () => {
        console.log(`✅ Finished parsing CSV. Total rows: ${colleges.length}`);
        
        // Delete existing data to avoid conflicts
        await prisma.college.deleteMany({});
        console.log("🗑️ Cleared existing colleges.");

        // Insert in batches of 5000
        const BATCH_SIZE = 5000;
        for (let i = 0; i < colleges.length; i += BATCH_SIZE) {
          const batch = colleges.slice(i, i + BATCH_SIZE);
          await prisma.college.createMany({
            data: batch,
            skipDuplicates: true,
          });
          console.log(`📦 Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} records)...`);
        }

        console.log("🎉 Successfully loaded all 37,700+ colleges!");

        console.log("🚀 Seeding exams...");
        const exams = [
          {
            name: 'JEE Main 2025',
            slug: 'jee-main-2025',
            category: 'Engineering',
            description: 'Joint Entrance Examination (Main) is a national level entrance exam conducted by NTA for admission to B.Tech/B.Arch courses.',
            content: '<p>JEE Main 2025 will be conducted in two sessions: January and April.</p>',
            eligibility: 'Candidates must have passed 10+2 or equivalent examinations with Physics, Mathematics, and one of the subjects from Chemistry/Biology/Biotechnology/Technical Vocational Subject.',
            syllabus: 'Physics, Chemistry, and Mathematics of Class 11 and 12.',
            dates: {
              create: [
                { event: 'Registration Start (Session 1)', date: 'November 2024' },
                { event: 'Exam Date (Session 1)', date: 'January 2025' }
              ]
            }
          },
          {
            name: 'NEET UG 2025',
            slug: 'neet-2025',
            category: 'Medical',
            description: 'National Eligibility cum Entrance Test is for admission to MBBS/BDS courses across India.',
            content: '<p>NEET is the only medical entrance exam in India.</p>',
            eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology.',
            syllabus: 'Physics, Chemistry, and Biology (Botany & Zoology) of Class 11 and 12.',
            dates: {
              create: [
                { event: 'Registration Start', date: 'February 2025' },
                { event: 'Exam Date', date: 'May 2025' }
              ]
            }
          },
          {
            name: 'CAT 2025',
            slug: 'cat-2025',
            category: 'Management',
            description: 'Common Admission Test is a premier management entrance exam for admission to IIMs and other top B-schools.',
            content: '<p>CAT is a computer-based test conducted by IIMs.</p>',
            eligibility: 'Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
            syllabus: 'VARC, DILR, and Quantitative Aptitude.',
            dates: {
              create: [
                { event: 'Registration Start', date: 'August 2025' },
                { event: 'Exam Date', date: 'November 2025' }
              ]
            }
          },
          {
            name: 'CLAT 2025',
            slug: 'clat-2025',
            category: 'Law',
            description: 'Common Law Admission Test is for admission to 22 National Law Universities (NLUs) in India.',
            content: '<p>CLAT is a national level entrance exam for UG and PG law courses.',
            eligibility: '10+2 or equivalent with 45% marks (40% for SC/ST).',
            syllabus: 'English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.',
            dates: {
              create: [
                { event: 'Registration Start', date: 'July 2024' },
                { event: 'Exam Date', date: 'December 2024' }
              ]
            }
          },
          {
            name: 'GATE 2025',
            slug: 'gate-2025',
            category: 'Engineering',
            description: 'Graduate Aptitude Test in Engineering is for admission to Master\'s programs and recruitment in PSUs.',
            content: '<p>GATE is conducted jointly by IISc and seven IITs.',
            eligibility: 'A candidate who is currently studying in the 3rd or higher years of any undergraduate degree program.',
            syllabus: 'General Aptitude and Candidate\'s chosen subject.',
            dates: {
              create: [
                { event: 'Registration Start', date: 'August 2024' },
                { event: 'Exam Date', date: 'February 2025' }
              ]
            }
          },
          {
            name: 'BITSAT 2025',
            slug: 'bitsat-2025',
            category: 'Engineering',
            description: 'Birla Institute of Technology and Science Admission Test is for admission to BITS campuses.',
            content: '<p>BITSAT is a computer-based online test for admission to Integrated First Degree programs of BITS Pilani, Goa, and Hyderabad.',
            eligibility: '12th pass with Physics, Chemistry, and Mathematics/Biology with minimum 75% marks.',
            syllabus: 'Physics, Chemistry, English Proficiency, Logical Reasoning, and Mathematics/Biology.',
            dates: {
              create: [
                { event: 'Registration Start', date: 'January 2025' },
                { event: 'Exam Date', date: 'May 2025' }
              ]
            }
          }
        ];

        for (const ex of exams) {
          await prisma.exam.upsert({
            where: { slug: ex.slug },
            update: {},
            create: ex
          });
        }
        console.log("✅ Exams seeded successfully!");

        resolve(true);
      })
      .on("error", (err) => {
        console.error("❌ Error reading CSV:", err);
        reject(err);
      });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());