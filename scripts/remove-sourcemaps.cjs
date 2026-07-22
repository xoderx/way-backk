const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, '..', 'dist');
function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}
if (fs.existsSync(distDir)) {
  console.log('--- Production Lockdown: Stripping Sourcemaps ---');
  walk(distDir, (filePath) => {
    // 1. Delete .map files
    if (filePath.endsWith('.map')) {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
    // 2. Remove source map references in JS and CSS files
    else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const strippedContent = content.replace(/\/\/[#@] sourceMappingURL=.*$/gm, '')
                                     .replace(/\/\*# sourceMappingURL=.* \*\/$/gm, '');
      if (content !== strippedContent) {
        fs.writeFileSync(filePath, strippedContent, 'utf8');
        console.log(`Stripped refs from: ${filePath}`);
      }
    }
  });
  console.log('--- Production Lockdown Complete ---');
}