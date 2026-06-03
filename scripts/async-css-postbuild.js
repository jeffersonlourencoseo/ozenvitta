import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

function getAllHtmlFiles(dir) {
  const files = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function transformCssToAsync(html) {
  // Substitui apenas links CSS do _astro (Tailwind CSS)
  return html.replace(
    /<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g,
    '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
  );
}

const distDir = 'dist';
const htmlFiles = getAllHtmlFiles(distDir);

let changedCount = 0;
for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf-8');
  const transformed = transformCssToAsync(content);
  if (transformed !== content) {
    writeFileSync(file, transformed, 'utf-8');
    changedCount++;
  }
}

console.log(`✅ CSS async: ${changedCount} arquivo(s) atualizado(s)`);
