const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name === 'route.js') {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.includes('export const runtime = \'edge\';')) {
        fs.writeFileSync(fullPath, 'export const runtime = \'edge\';\n' + content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app/api'));
console.log('Done adding edge runtime');
