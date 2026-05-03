
const fs = require('fs');
const path = require('path');

function scan(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git') return;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scan(filePath);
    } else {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('next/document')) {
        console.log('FOUND next/document in:', filePath);
      }
      if (content.includes('<Html') || content.includes('<Head') || content.includes('<NextScript')) {
         // Some of these might be legitimate lowercase <html> tags, so check for uppercase
         if (content.includes('<Html') || content.includes('<NextScript')) {
            console.log('FOUND forbidden tag in:', filePath);
         }
      }
    }
  });
}

scan('c:\\Data\\College\\frontend');
