import { PrismaClient } from "@prisma/client";
import { MASTER_COLLEGES } from "./seed_data";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding colleges...");

  for (const c of MASTER_COLLEGES) {
    const slug = c.slug;

    await prisma.college.upsert({
      where: { slug },
      update: {},
      create: {
        name: c.name,
        slug,
        location: `${c.city}, ${c.state}`, // ✅ fixed
        city: c.city,
        state: c.state,
        ownership: c.ownership,
        established: c.established,
        fees: c.fees,
        rating: c.rating,
        placementPercent: c.placementPercent,
        avgPackage: c.avgPackage,
        exams: c.exams,
        degrees: c.degrees,
        description: c.description,
        imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800", // ✅ fixed

        courses: {
          create: [
            {
              name: (c.degrees[0] || "Bachelor") + " Course",
              duration: "3-4 Years",
              fees: c.fees,
              seats: 120,
              eligibility: "12th Grade",
            },
          ],
        },

        reviews: {
          create: [
            {
              authorName: "Verified Student",
              rating: Math.floor(c.rating),
              comment: "Quality education and excellent environment.",
              year: 2023,
            },
          ],
        },
      },
    });

    console.log(`✅ Seeded: ${c.name}`); // ✅ fixed
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());