const fs = require("fs");
const path = require("path");

const ROOT_DIR = "C:\\Data\\College\\frontend";

const IGNORE_FOLDERS = ["node_modules", ".next", ".git"];

function scan(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (IGNORE_FOLDERS.includes(file)) return;

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scan(filePath);
    } else {
      if (!file.endsWith(".js") && !file.endsWith(".jsx") && !file.endsWith(".tsx")) return;

      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const lineNum = index + 1;

        if (line.includes("next/document")) {
          console.log(`❌ INVALID IMPORT → ${filePath}:${lineNum}`);
        }

        if (
          line.includes("<Html") ||
          line.includes("<NextScript")
        ) {
          console.log(`🚫 FORBIDDEN TAG → ${filePath}:${lineNum}`);
        }
      });
    }
  });
}

console.log("🔍 Scanning...");
scan(ROOT_DIR);
console.log("✅ Done");