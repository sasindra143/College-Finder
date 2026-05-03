
const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        findFiles(filePath, filter, fileList);
      }
    } else if (filter.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = 'c:\\Data\\College\\frontend\\src';
const files = findFiles(srcDir, /\.(tsx|ts|js|jsx)$/);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('useContext') || content.includes('useState') || content.includes('useEffect') || content.includes('useCallback') || content.includes('useMemo') || content.includes('useRef')) {
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      console.log('Missing "use client" in:', file);
    }
  }
});
