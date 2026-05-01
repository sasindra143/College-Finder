import { PrismaClient } from "@prisma/client";
import { MASTER_COLLEGES } from "./seed_data";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding colleges...");

  await prisma.college.createMany({
    data: MASTER_COLLEGES.map((c) => ({
      name: c.name,
      slug: c.slug,
      location: `${c.city}, ${c.state}`,
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
      imageUrl:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=800"
    })),
    skipDuplicates: true
  });

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());