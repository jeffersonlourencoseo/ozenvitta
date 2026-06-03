const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'public', 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const BRAND = '#513F7E';
const BRAND_LIGHT = '#7361AE';
const ACCENT = '#EE352F';
const WHITE = '#FFFFFF';
const BG = '#F5F5F8';

function makeOG(title, subtitle, filename) {
  const svg = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${BRAND};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${BRAND_LIGHT};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="200" fill="url(#grad)" />
    <rect y="200" width="1200" height="430" fill="${BG}" />
    <text x="60" y="300" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${BRAND}">${escapeXml(title)}</text>
    <text x="60" y="380" font-family="Arial, sans-serif" font-size="32" fill="#333333">${escapeXml(subtitle)}</text>
    <rect x="60" y="480" width="340" height="80" rx="30" fill="${ACCENT}" />
    <text x="80" y="530" font-family="Arial, sans-serif" font-size="28" fill="${WHITE}">blogmounjax.com.br</text>
  </svg>`;

  return sharp(Buffer.from(svg))
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(outDir, filename))
    .then(() => console.log('Generated', filename));
}

function makeProduct(filename) {
  const svg = `
  <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="800" fill="${BG}" />
    <rect x="250" y="80" width="300" height="560" rx="40" fill="#e6e6f0" stroke="${BRAND}" stroke-width="4" />
    <rect x="300" y="140" width="200" height="460" rx="20" fill="${WHITE}" />
    <rect x="300" y="80" width="200" height="60" rx="15" fill="${BRAND}" />
    <text x="320" y="320" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${BRAND}">Mounjax</text>
    <text x="340" y="400" font-family="Arial, sans-serif" font-size="40" fill="${BRAND_LIGHT}">30ml Gotas</text>
    <text x="340" y="460" font-family="Arial, sans-serif" font-size="28" fill="${ACCENT}">100% Natural</text>
  </svg>`;

  return sharp(Buffer.from(svg))
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(outDir, filename))
    .then(() => console.log('Generated', filename));
}

function makeLogo(filename) {
  const svg = `
  <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="${WHITE}" />
    <rect x="50" y="50" width="412" height="412" rx="60" fill="${BRAND}" />
    <text x="90" y="260" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${WHITE}">Mounjax</text>
    <text x="120" y="340" font-family="Arial, sans-serif" font-size="48" fill="#c8c8dd">Review</text>
  </svg>`;

  return sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outDir, filename))
    .then(() => console.log('Generated', filename));
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

(async () => {
  await makeOG('Mounjax Funciona?', 'Análise Completa 2026', 'og-default.jpg');
  await makeOG('O que é o Mounjax?', 'Suplemento Natural em Gotas', 'og-o-que-e.jpg');
  await makeOG('Composição do Mounjax', '9 Ingredientes Naturais', 'og-composicao.jpg');
  await makeOG('Benefícios do Mounjax', 'Queima de Gordura e Saciedade', 'og-beneficios.jpg');
  await makeOG('Como Usar Mounjax', '12 Gotas por Dia', 'og-como-usar.jpg');
  await makeOG('Contraindicações', 'Quem Não Pode Usar', 'og-contraindicacoes.jpg');
  await makeOG('Depoimentos Reais', 'Resultados de Quem Usou', 'og-depoimentos.jpg');
  await makeOG('Onde Comprar', 'Preço e Desconto Oficial', 'og-onde-comprar.jpg');
  await makeProduct('mounjax-produto.jpg');
  await makeLogo('logo.png');
  console.log('All images generated successfully!');
})();
