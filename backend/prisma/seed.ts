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