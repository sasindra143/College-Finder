const fs = require("fs");
const path = require("path");

const ROOT_DIR = "C:\\Data\\College\\frontend";

// folders to ignore
const IGNORE_FOLDERS = ["node_modules", ".next", ".git", "dist", "build"];

// extensions to scan
const VALID_EXT = [".js", ".jsx", ".ts", ".tsx"];

// check file extension
function isValidFile(file) {
  return VALID_EXT.includes(path.extname(file));
}

// scan directory
function scan(dir) {
  let files;

  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // skip unwanted folders
    if (IGNORE_FOLDERS.includes(file)) return;

    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (err) {
      return;
    }

    if (stat.isDirectory()) {
      scan(filePath);
    } else {
      if (!isValidFile(file)) return;

      let content;
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch (err) {
        return;
      }

      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // ❌ wrong import
        if (line.includes("next/document")) {
          console.log(`❌ INVALID IMPORT → ${filePath}:${lineNum}`);
          console.log(`   ${line.trim()}`);
        }

        // ❌ forbidden tags
        if (
          line.includes("<Html") ||
          line.includes("<Head") ||
          line.includes("<NextScript")
        ) {
          console.log(`🚫 FORBIDDEN TAG → ${filePath}:${lineNum}`);
          console.log(`   ${line.trim()}`);
        }
      });
    }
  });
}

// run scan
console.log("🔍 Scanning project for Next.js errors...\n");
scan(ROOT_DIR);
console.log("\n✅ Scan completed.");