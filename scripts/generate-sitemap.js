/**
 * Gerador de Sitemap pós-build
 * Escaneia a pasta dist/ e gera sitemap.xml + sitemap-index.xml
 */

import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const DOMAIN = 'https://mounjax-five.vercel.app';
const DIST = resolve(process.cwd(), 'dist');

// Rotas que NÃO devem entrar no sitemap
const EXCLUDED = new Set([]);

function getRoutes(dir, base = '') {
  const routes = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    if (entry === '_astro' || entry.startsWith('.')) continue;

    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const route = base + '/' + entry;
      // Se contém index.html, é uma página
      if (existsSync(join(fullPath, 'index.html'))) {
        if (!EXCLUDED.has(route)) {
          routes.push(route);
        }
      }
      // Navega recursivamente para subpastas
      routes.push(...getRoutes(fullPath, route));
    }
  }

  return routes;
}

const routes = getRoutes(DIST);
// Adiciona a home se não estiver presente
if (!routes.includes('/')) routes.unshift('/');

// Remove duplicados e ordena
const uniqueRoutes = [...new Set(routes)].sort();

// Prioridades por padrão de rota
function getPriority(route) {
  if (route === '/') return '1.0';
  if (route.includes('onde-comprar')) return '0.9';
  if (route.includes('o-que-e') || route.includes('composicao') || route.includes('beneficios')) return '0.9';
  if (route.includes('como-usar') || route.includes('contraindicacoes') || route.includes('depoimentos')) return '0.8';
  if (route.includes('reclame-aqui') || route.includes('mounjax-gotas')) return '0.8';
  if (route.includes('politica-de-privacidade') || route.includes('termos-de-uso') || route.includes('politica-de-cookies')) return '0.3';
  return '0.5';
}

function getFreq(route) {
  if (route === '/') return 'weekly';
  if (route.includes('onde-comprar')) return 'weekly';
  return 'monthly';
}

const today = new Date().toISOString().split('T')[0];

const urlEntries = uniqueRoutes
  .map((route) => {
    const loc = DOMAIN + (route === '/' ? '/' : route + '/');
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getFreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap.trim());
writeFileSync(join(DIST, 'sitemap-index.xml'), sitemapIndex.trim());

console.log(`✅ Sitemap gerado: ${uniqueRoutes.length} rotas`);
console.log('   → dist/sitemap.xml');
console.log('   → dist/sitemap-index.xml');
