#!/usr/bin/env node
/**
 * GERADOR AUTOMÁTICO DE SITE REVIEW
 *
 * Uso:
 *   node scripts/create-new-site.js scripts/produto-template.json
 *
 * Ou, se estiver na pasta do projeto:
 *   npm run create-site -- scripts/produto-template.json
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// CONFIGURAÇÕES
// =============================================================================

const TEMPLATE_DIR = path.resolve(__dirname, '..'); // pasta do projeto modelo
const args = process.argv.slice(2);
const jsonPath = args[0] ? path.resolve(args[0]) : path.join(TEMPLATE_DIR, 'scripts', 'produto-template.json');

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Arquivo JSON não encontrado: ${jsonPath}`);
  console.error('Uso: node scripts/create-new-site.js caminho/para/produto.json');
  process.exit(1);
}

// =============================================================================
// LER JSON
// =============================================================================

const raw = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);
const P = data.produto;
const C = data.conteudo;

const NOME = P.nome;
const NOME_LOWER = NOME.toLowerCase();
const NOME_UPPER = NOME.toUpperCase();
const NOME_CAP = NOME.charAt(0).toUpperCase() + NOME.slice(1);
const SLUG = P.nomeSlug;
const FORMATO = P.formato; // gotas, capsulas, etc
const FORMATO_PLURAL = FORMATO + (FORMATO.endsWith('s') ? '' : 's');

// Pasta de destino (irmã do projeto modelo)
const DEST_DIR = path.resolve(TEMPLATE_DIR, '..', `${SLUG}-site`);

console.log(`\n🏗️  GERADOR DE SITE: ${NOME}`);
console.log(`📁 Destino: ${DEST_DIR}\n`);

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // Pular pastas que não devem ser copiadas
      if (['node_modules', '.git', '.astro', '.vercel', 'dist'].includes(entry.name)) continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

function replaceInFile(filePath, replacements) {
  let content = readFile(filePath);
  for (const [oldStr, newStr] of replacements) {
    content = content.split(oldStr).join(newStr);
  }
  writeFile(filePath, content);
}

function replaceInAllFiles(dir, replacements, extensions = ['.ts', '.tsx', '.astro', '.md', '.mjs', '.json', '.txt', '.md']) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.astro', '.vercel', 'dist'].includes(entry.name)) continue;
      replaceInAllFiles(fullPath, replacements, extensions);
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      replaceInFile(fullPath, replacements);
    }
  }
}

// =============================================================================
// 1. COPIAR PROJETO BASE
// =============================================================================

if (fs.existsSync(DEST_DIR)) {
  console.log(`⚠️  A pasta ${DEST_DIR} já existe.`);
  console.log('   Delete-a primeiro ou escolha outro nome.\n');
  process.exit(1);
}

console.log('⏳ Copiando projeto base...');
copyDir(TEMPLATE_DIR, DEST_DIR);
console.log('✅ Projeto copiado.\n');

// =============================================================================
// 2. LIMPAR ARQUIVOS DESNECESSÁRIOS
// =============================================================================

const toRemove = [
  path.join(DEST_DIR, 'scripts', 'create-new-site.js'),
  path.join(DEST_DIR, 'scripts', 'produto-template.json'),
  path.join(DEST_DIR, 'BLUEPRINT-SITE-REVIEW.md'),
  path.join(DEST_DIR, 'COMO-USAR-BLUEPRINT.txt'),
  path.join(DEST_DIR, 'RESUMO-SESSAO-2026-06-01.md'),
  path.join(DEST_DIR, 'README.md'),
];

for (const p of toRemove) {
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

// =============================================================================
// 3. REPLACE GLOBAL EM TODO O PROJETO
// =============================================================================

console.log('⏳ Substituindo referências ao produto antigo...');

const globalReplacements = [
  ['Blog Mounjax', P.siteName],
  ['blogmounjax.com.br', P.email.split('@')[1] || 'blog.com.br'],
  ['mounjax-five.vercel.app', P.dominio.replace('https://', '').replace('http://', '')],
  ['https://mounjax-five.vercel.app', P.dominio],
  ['Mounjax Review', `${NOME_CAP} Review`],
  ['mounjax.com', P.siteOficial.replace('https://', '').replace('http://', '')],
  ['https://mounjax.com', P.siteOficial],
  ['https://app.monetizze.com.br/r/ATX25785612', P.linkAfiliado],
  ['ATX25785612', P.linkAfiliado.split('/').pop() || 'SEU_CODIGO'],
  ['Dra. Ana Luiza Mendes', P.expertNome],
  ['Nutricionista Funcional e Especialista em Suplementação Natural', P.expertCargo],
  ['contato@blogmounjax.com.br', P.email],
  ['MOUNJAX-30ML-GOTAS', P.sku],
  ['#513F7E', P.corTema],
  ['Blog Mounjax', P.siteName],
  ['Mounjax Funciona?', `${NOME_CAP} Funciona?`],
  ['mounjax funciona', `${NOME_LOWER} funciona`],
  ['mounjax funciona mesmo', `${NOME_LOWER} funciona mesmo`],
  ['o que é mounjax', `o que é ${NOME_LOWER}`],
  ['pra que serve o mounjax', `pra que serve o ${NOME_LOWER}`],
  ['mounjax para que serve', `${NOME_LOWER} para que serve`],
  ['mounjax como funciona', `${NOME_LOWER} como funciona`],
  ['mounjax em gotas', `${NOME_LOWER} em ${FORMATO_PLURAL}`],
  ['mounjax gotas', `${NOME_LOWER} ${FORMATO_PLURAL}`],
  ['mounjax suplemento', `${NOME_LOWER} suplemento`],
  ['mounjax emagrece', `${NOME_LOWER} emagrece`],
  ['mounjax para emagrecer', `${NOME_LOWER} para emagrecer`],
  ['mounjax preço', `${NOME_LOWER} preço`],
  ['mounjax valor', `${NOME_LOWER} valor`],
  ['mounjax reclame aqui', `${NOME_LOWER} reclame aqui`],
  ['mounjax onde comprar', `${NOME_LOWER} onde comprar`],
  ['mounjax desconto', `${NOME_LOWER} desconto`],
  ['mounjax ozenpharma', `${NOME_LOWER}`],
  ['mounjax beneficios', `${NOME_LOWER} beneficios`],
  ['mounjax resultado', `${NOME_LOWER} resultado`],
  ['mounjax antes e depois', `${NOME_LOWER} antes e depois`],
  ['mounjax depoimentos', `${NOME_LOWER} depoimentos`],
  ['mounjax site oficial', `${NOME_LOWER} site oficial`],
  ['mounjax kit', `${NOME_LOWER} kit`],
  ['mounjax frete gratis', `${NOME_LOWER} frete gratis`],
  ['12 gotas', P.dosagem],
  ['9 ingredientes', `${P.quantidadeIngredientes} ingredientes`],
  ['9 componentes', `${P.quantidadeIngredientes} componentes`],
  ['30ml', P.volumeFrasco],
  ['R$ 147,00', `R$ ${P.precoAvista1}`],
  ['R$ 197,00', `R$ ${P.precoPopular}`],
  ['R$ 247,00', `R$ ${P.precoAvista5}`],
  ['R$ 377,00', `R$ ${P.precoAvista8}`],
  ['12x R$ 14,76', `12x R$ ${P.precoParcelado1}`],
  ['12x R$ 19,78', `12x R$ ${P.precoParcelado3}`],
  ['12x R$ 24,90', `12x R$ ${P.precoParcelado5}`],
  ['12x R$ 37,90', `12x R$ ${P.precoParcelado8}`],
  ['Mounjax', NOME_CAP],
  ['mounjax', NOME_LOWER],
  ['MOUNJAX', NOME_UPPER],
];

replaceInAllFiles(DEST_DIR, globalReplacements);
console.log('✅ Referências substituídas.\n');

// =============================================================================
// 3.5 GERAR ARQUIVO DE PALAVRAS-CHAVE (KW-{produto}.txt) — TEMPLATE PARA PREENCHIMENTO MANUAL
// =============================================================================

console.log('⏳ Gerando template de palavras-chave...');

const kwContent = `============================================================
PALAVRAS-CHAVE — ${NOME_CAP}
============================================================

PREENCHA ESTE ARQUIVO MANUALMENTE ou envie para mim.
Essas palavras guiarao TODO o copy do site.

INSTRUCOES:
- Uma palavra por linha
- Use # para comentarios (serao ignorados)
- Preencha TODAS as secoes abaixo
- Me envie este arquivo preenchido e eu atualizo o site

============================================================
PALAVRAS PRINCIPAIS (volume alto, intencao de compra)
============================================================

${NOME_LOWER} funciona
${NOME_LOWER} funciona mesmo
${NOME_LOWER} emagrece
${NOME_LOWER} preco
${NOME_LOWER} valor
${NOME_LOWER} onde comprar
${NOME_LOWER} site oficial
${NOME_LOWER} desconto
${NOME_LOWER} kit

# Adicione mais abaixo:


============================================================
PALAVRAS INFORMATIVAS (o que e, como usar)
============================================================

o que e ${NOME_LOWER}
pra que serve o ${NOME_LOWER}
${NOME_LOWER} composicao
${NOME_LOWER} beneficios
${NOME_LOWER} contraindicacoes

# Adicione mais abaixo:


============================================================
PALAVRAS DE REVIEW / AVALIACAO
============================================================

${NOME_LOWER} reclame aqui
${NOME_LOWER} depoimentos
${NOME_LOWER} resultados
${NOME_LOWER} antes e depois
${NOME_LOWER} e bom

# Adicione mais abaixo:


============================================================
PALAVRAS DE NICHO (ex: emagrecimento, energia, etc)
============================================================

suplemento para emagrecer
emagrecer naturalmente
acelerar metabolismo

# Adicione mais abaixo:


============================================================
PALAVRAS DE MARCA / CONCORRENCIA (se houver)
============================================================

# Exemplo: "substituto do [produto concorrente]"


============================================================
`;

writeFile(path.join(DEST_DIR, `KW-${NOME_LOWER}.txt`), kwContent);
console.log(`✅ Template KW-${NOME_LOWER}.txt gerado na raiz do projeto.\n`);

// =============================================================================
// 4. GERAR src/data/config.ts
// =============================================================================

console.log('⏳ Gerando config.ts...');

const configContent = `/**
 * CENTRAL DE DADOS — CÉREBRO DO SITE
 * Todas as informações globais do ${P.siteName.toLowerCase().replace(/\s/g, '')}.com.br
 */

export const SITE_CONFIG = {
  // Domínio e identidade
  domain: '${P.dominio}',
  siteName: '${P.siteName}',
  tagline: '${P.tagline}',
  language: 'pt-BR',
  locale: 'pt_BR',

  // SEO Defaults
  titleDefault: '${NOME_CAP} Funciona? Análise 2026 — ${P.dosagem}',
  descriptionDefault:
    '${NOME_CAP} em ${FORMATO_PLURAL}: ${P.dosagem}, ${P.quantidadeIngredientes} ingredientes naturais. Veja preços, kits com até 40% OFF e garantia de ${P.tempoGarantiaDias} dias.',
  keywordsDefault:
    '${NOME_LOWER} funciona, ${NOME_LOWER} funciona mesmo, o que é ${NOME_LOWER}, pra que serve o ${NOME_LOWER}, ${NOME_LOWER} preço, ${NOME_LOWER} valor, ${NOME_LOWER} para emagrecer, ${NOME_LOWER} para que serve, ${NOME_LOWER} ${FORMATO_PLURAL}, ${NOME_LOWER} em ${FORMATO_PLURAL}, ${NOME_LOWER} emagrece, ${NOME_LOWER} reclame aqui, ${NOME_LOWER} onde comprar, ${NOME_LOWER} desconto',

  // Branding & E-E-A-T
  author: {
    name: '${P.siteName}',
    role: 'Especialistas em ${P.categoria}',
    email: '${P.email}',
    since: '2025',
  },

  // Autor especialista para schemas Article (Person)
  expert: {
    name: '${P.expertNome}',
    jobTitle: '${P.expertCargo}',
    url: '${P.dominio}/sobre-nos/',
    description:
      '${P.expertDescricao}',
  },

  // Redes sociais
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
  },

  // Produto review
  product: {
    name: '${NOME_CAP}',
    brand: '${NOME_CAP}',
    category: '${P.categoria}',
    officialUrl: '${P.siteOficial}',
    affiliateLink: '${P.linkAfiliado}',
    price: '${P.precoPopular}',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    sku: '${P.sku}',
    image: '${P.productImage}',
    aggregateRating: {
      ratingValue: '${P.ratingValue}',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '${P.reviewCount}',
    },
  },

  // Afiliados & Disclaimer
  affiliate: {
    disclaimer:
      'Este site contém links de afiliados via Monetizze. Ao comprar por nossos links, podemos receber uma comissão, sem custo adicional para você.',
    partner: '${NOME_CAP} — Programa de Afiliados Monetizze',
  },

  // Performance & SEO
  ogImage: '${P.ogImage}',
  twitterHandle: '',
  themeColor: '${P.corTema}',
} as const;

export type SiteConfig = typeof SITE_CONFIG;
`;

writeFile(path.join(DEST_DIR, 'src', 'data', 'config.ts'), configContent);
console.log('✅ config.ts gerado.\n');

// =============================================================================
// 5. GERAR PÁGINAS .md
// =============================================================================

console.log('⏳ Gerando páginas de conteúdo (.md)...');

const pagesDir = path.join(DEST_DIR, 'src', 'content', 'pages');
ensureDir(pagesDir);

function ctaInline() {
  return `<div style="text-align:center;margin:2rem 0;">
  <a href="${P.linkAfiliado}"
     target="_blank"
     rel="noopener noreferrer nofollow sponsored"
     style="display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#fff;background:#e74c3c;padding:1rem 2rem;border-radius:9999px;text-decoration:none;font-size:0.95rem;"
  >
    Site oficial ${NOME_CAP} com desconto →
  </a>
  <p style="font-size:0.85rem;color:rgba(26,26,46,0.6);margin-top:0.75rem;">
    Frete Grátis | Garantia ${P.tempoGarantiaDias} Dias | 12x no cartão
  </p>
</div>`;
}

// --- O QUE É ---
const beneficiosMd = C.oQueE.beneficiosList.map(b => `- **${b}**`).join('\n');
const problemasMd = C.oQueE.problemasTabela.map(p => `| ${p.problema} | ${p.solucao} |`).join('\n');
const ecossistemaMd = C.oQueE.ecossistema.map(e => `- ${e}`).join('\n');

const oQueEContent = `---
title: "O que é ${NOME_CAP}? Pra que Serve, Como Funciona e Onde Comprar [2026]"
description: "Descubra o que é o ${NOME_CAP} em ${FORMATO_PLURAL}: ${P.categoria.toLowerCase()} com ${P.quantidadeIngredientes} ingredientes ativos. Pra que serve, como funciona, dosagem e onde comprar com desconto."
keywords: "${NOME_LOWER} o que é, pra que serve o ${NOME_LOWER}, ${NOME_LOWER} para que serve, ${NOME_LOWER} como funciona, ${NOME_LOWER} em ${FORMATO_PLURAL}, ${NOME_LOWER} ${FORMATO_PLURAL}, ${NOME_LOWER} suplemento, ${NOME_LOWER} emagrece"
order: 1
navLabel: "O que é"
---

Se você está buscando uma alternativa natural para emagrecer sem passar fome, sem dietas malucas e sem engolir cápsulas grandes, este guia é para você.

Aqui, explicamos **tudo sobre o ${NOME_CAP}** — o suplemento em ${FORMATO_PLURAL} que já ajudou mais de ${P.socialProofNumero} ${P.socialProofTexto} a recuperarem a autoestima.

${ctaInline()}

---

## 💧 O que é o ${NOME_CAP}?

O **${NOME_CAP}** é um suplemento alimentar natural em **${FORMATO_PLURAL}** (${P.volumeFrasco} por frasco), desenvolvido com ${P.quantidadeIngredientes} componentes ativos que trabalham em sinergia para:

${beneficiosMd}

A dosagem é simples: **apenas ${P.dosagem}**, preferencialmente no mesmo horário, combinadas com água e uma rotina equilibrada.

> **Por que ${FORMATO_PLURAL}?** Diferente de cápsulas, a apresentação em ${FORMATO_PLURAL} oferece absorção mais rápida e dosagem precisa.

---

## 🎯 Pra que Serve o ${NOME_CAP}?

A fórmula exclusiva do ${NOME_CAP} foi pensada para quem deseja emagrecer **sem passar fome** ou recorrer a dietas restritivas.

| Problema | Como o ${NOME_CAP} Ajuda |
|---|---|
${problemasMd}

${ctaInline()}

---

## 🔄 Como Funciona o ${NOME_CAP}?

O ${NOME_CAP} funciona em **três frentes simultâneas**:

### 1. Ignição Metabólica (Queima)
Acelera o gasto calórico basal. Seu corpo queima mais energia 24 horas por dia — até dormindo.

### 2. Controle do Apetite (Saciedade)
Promove plenitude no estômago. Você naturalmente come menos, sem força de vontade.

### 3. Limpeza Interna (Detox)
Elimina toxinas que prejudicam o metabolismo e causam inchaço.

---

## 🎁 Ecossistema ${NOME_CAP} incluso na compra oficial:

${ecossistemaMd}

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'o-que-e.md'), oQueEContent);

// --- COMPOSIÇÃO ---
const ingredientesMd = C.composicao.ingredientes.map(ing => `## ${ing.emoji} ${ing.nome}\n\n${ing.acao}.`).join('\n\n');

const composicaoContent = `---
title: "Composição do ${NOME_CAP}: Veja os ${P.quantidadeIngredientes} Ingredientes da Fórmula"
description: "Conheça a composição completa do ${NOME_CAP}: cada ingrediente, sua ação científica e como trabalham em sinergia. Fórmula 100% natural e segura."
keywords: "${NOME_LOWER} composição, ${NOME_LOWER} ingredientes, ${NOME_LOWER} fórmula, ${NOME_LOWER} é natural, ${NOME_LOWER} componentes"
order: 2
navLabel: "Composição"
---

A fórmula do ${NOME_CAP} foi desenvolvida por especialistas em suplementação natural, combinando ${P.quantidadeIngredientes} ingredientes com ação comprovada na literatura científica.

${ctaInline()}

---

${ingredientesMd}

---

## ⚗️ Sinergia da Fórmula

${C.composicao.sinergia}

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'composicao.md'), composicaoContent);

// --- BENEFÍCIOS ---
const beneficiosItensMd = C.beneficios.itens.map((b, i) => `## ${b.emoji} ${i + 1}. ${b.titulo}\n\n${b.descricao}\n\n> **Resultado prático:** ${b.resultadoPratico}`).join('\n\n');

const beneficiosContent = `---
title: "Benefícios do ${NOME_CAP}: Emagrece? Veja os Principais"
description: "Descubra se o ${NOME_CAP} emagrece de verdade. Conheça os principais benefícios do suplemento em ${FORMATO_PLURAL} do ${NOME_CAP}."
keywords: "${NOME_LOWER} beneficios, ${NOME_LOWER} emagrece, ${NOME_LOWER} funciona, ${NOME_LOWER} resultado, ${NOME_LOWER} antes e depois, ${NOME_LOWER} depoimentos"
order: 3
navLabel: "Benefícios"
---

A pergunta que não quer calar entre quem descobre o produto é: **“${NOME_CAP} emagrece?”**

A resposta curta é **sim** — mas o emagrecimento acontece de forma natural, gradual e sustentável.

${ctaInline()}

---

${beneficiosItensMd}

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'beneficios.md'), beneficiosContent);

// --- COMO USAR ---
const comoUsarPassos = C.comoUsar.passos.map((p, i) => `### ${i + 1}. ${p.nome}\n${p.texto}`).join('\n\n');
const timelineMd = C.comoUsar.timeline.map(t => `| ${t.tempo} | ${t.efeito} |`).join('\n');

const comoUsarContent = `---
title: "Como Usar o ${NOME_CAP}: Dosagem, Horário e Duração [Guia]"
description: "Aprenda como usar o ${NOME_CAP} corretamente: dosagem, melhor horário, duração do tratamento e dicas para potencializar resultados."
keywords: "${NOME_LOWER} como usar, ${NOME_LOWER} dosagem, ${NOME_LOWER} horário, ${NOME_LOWER} quanto tempo, ${NOME_LOWER} duração"
order: 4
navLabel: "Como Usar"
---

Usar o ${NOME_CAP} corretamente é fundamental para obter os melhores resultados. Veja o passo a passo completo.

${ctaInline()}

---

## 📋 Passo a Passo

${comoUsarPassos}

---

## 📅 Timeline de Resultados

| Período | O que Esperar |
|---|---|
${timelineMd}

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'como-usar.md'), comoUsarContent);

// --- CONTRAINDICAÇÕES ---
const quemNaoPodeMd = C.contraindicacoes.quemNaoPode.map(q => `- ${q}`).join('\n');
const interacoesMd = C.contraindicacoes.interacoes.map(i => `- ${i}`).join('\n');

const contraindicacoesContent = `---
title: "Contraindicações do ${NOME_CAP}: Quem Não Pode Usar?"
description: "Saiba quem não pode usar ${NOME_CAP}, interações medicamentosas, efeitos colaterais possíveis e orientações de segurança antes de comprar."
keywords: "${NOME_LOWER} contraindicações, ${NOME_LOWER} efeitos colaterais, ${NOME_LOWER} quem não pode usar, ${NOME_LOWER} gravidez, ${NOME_LOWER} interação"
order: 5
navLabel: "Contraindicações"
---

Embora o ${NOME_CAP} seja composto por ingredientes naturais, é importante conhecer as contraindicações antes de iniciar o uso.

${ctaInline()}

---

## 🚫 Quem Não Deve Usar

${quemNaoPodeMd}

---

## 💊 Interações Medicamentosas

${interacoesMd}

---

## ⚠️ Efeitos Colaterais

${C.contraindicacoes.efeitos}

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'contraindicacoes.md'), contraindicacoesContent);

// --- DEPOIMENTOS ---
const depoimentosMd = C.depoimentos.map(d => `> **${d.nome}, ${d.idade} anos — ${d.cidade}**\n> Usou ${d.kit} por ${d.tempoUso}.\n> \n> "${d.texto}"`).join('\n\n');

const depoimentosContent = `---
title: "Depoimentos do ${NOME_CAP}: Resultados Reais de Quem Usou"
description: "Veja depoimentos reais de quem usou ${NOME_CAP}. Fotos antes e depois, experiências e resultados de mulheres que transformaram o corpo."
keywords: "${NOME_LOWER} depoimentos, ${NOME_LOWER} resultados, ${NOME_LOWER} antes e depois, ${NOME_LOWER} fotos, ${NOME_LOWER} relatos"
order: 6
navLabel: "Depoimentos"
---

Estes são relatos de pessoas reais que usaram o ${NOME_CAP} e tiveram resultados significativos.

${ctaInline()}

---

${depoimentosMd}

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'depoimentos.md'), depoimentosContent);

// --- ONDE COMPRAR ---
const kitsMd = C.ondeComprar.kits.map(kit => {
  const btnCor = kit.popular ? '#2d9cdb' : '#e74c3c';
  return `### ${kit.nome}\n\n- <span style="font-size:1.25rem;color:#e74c3c;font-weight:700;">${kit.parcelado}</span> <span style="font-size:0.85rem;color:rgba(26,26,46,0.5);">no cartão</span>\n- <span style="font-size:0.85rem;color:rgba(26,26,46,0.5);">À vista R$ ${kit.avista}</span>\n\n<div style="text-align:center;margin:1.5rem 0;">\n  <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" style="display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#fff;background:${btnCor};padding:0.75rem 1.5rem;border-radius:9999px;text-decoration:none;font-size:0.9rem;">\n    Comprar →\n  </a>\n</div>`;
}).join('\n\n---\n\n');

const naoComprarMd = C.ondeComprar.naoComprar.map(n => `- ❌ ${n}`).join('\n');

const ondeComprarContent = `---
title: "Onde Comprar ${NOME_CAP} Original: Preço, Kits e Desconto"
description: "Compre o ${NOME_CAP} original apenas no site oficial do ${NOME_CAP}. Veja preços atualizados, kits promocionais, frete grátis, garantia de ${P.tempoGarantiaDias} dias."
keywords: "${NOME_LOWER} onde comprar, ${NOME_LOWER} preço, ${NOME_LOWER} valor, ${NOME_LOWER} site oficial, ${NOME_LOWER} desconto, ${NOME_LOWER} kit, ${NOME_LOWER} frete gratis"
order: 7
navLabel: "Onde Comprar"
---

Se você chegou até aqui, provavelmente já pesquisou sobre o ${NOME_CAP} e quer saber:\n\n- **Qual o preço do ${NOME_CAP}?**\n- **Onde comprar com segurança?**\n\nEsta página traz todas as informações atualizadas sobre valores, kits e descontos.

${ctaInline()}

---

## ⚠️ Evite Falsificações

O ${NOME_CAP} original em ${FORMATO_PLURAL} **só é vendido pelo site oficial** (${P.siteOficial.replace('https://', '')}).\n\nNão compre em:\n\n${naoComprarMd}\n\nProdutos vendidos fora do canal oficial podem ser falsificados, adulterados ou vencidos.

---

## 💰 ${NOME_CAP} Preço — Kits Oficiais Atualizados

${kitsMd}

---

## 🛡️ Garantia de ${P.tempoGarantiaDias} Dias

Você tem ${P.tempoGarantiaDias} dias para testar. Se não ficar satisfeito, devolvemos 100% do valor pago.

${ctaInline()}
`;
writeFile(path.join(pagesDir, 'onde-comprar.md'), ondeComprarContent);

console.log('✅ 7 páginas .md geradas.\n');

// =============================================================================
// 6. ATUALIZAR index.astro
// =============================================================================

console.log('⏳ Atualizando index.astro...');

const faqSchema = C.faq.map(f => `    { question: '${f.pergunta.replace(/'/g, "\\'")}', answer: '${f.resposta.replace(/'/g, "\\'")}' }`).join(',\n');
const howToSchema = C.comoUsar.passos.map(p => `    { name: '${p.nome.replace(/'/g, "\\'")}', text: '${p.texto.replace(/'/g, "\\'")}' }`).join(',\n');

const beneficiosInline = C.oQueE.beneficiosList.map(b => `- **${b}**`).join(', ');

const indexContent = `---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
---

<Layout
  title="${NOME_CAP} Funciona? Análise 2026 — ${P.dosagem}"
  description="${NOME_CAP} em ${FORMATO_PLURAL}: ${P.dosagem}, ${P.quantidadeIngredientes} ingredientes naturais, ${P.bonusApp} e ${P.bonusEbooks}. Veja preços, kits com até 40% OFF e garantia de ${P.tempoGarantiaDias} dias."
  keywords="${NOME_LOWER} funciona, ${NOME_LOWER} funciona mesmo, o que é ${NOME_LOWER}, pra que serve o ${NOME_LOWER}, ${NOME_LOWER} preço, ${NOME_LOWER} valor, ${NOME_LOWER} para emagrecer, ${NOME_LOWER} para que serve, ${NOME_LOWER} ${FORMATO_PLURAL}, ${NOME_LOWER} em ${FORMATO_PLURAL}, ${NOME_LOWER} emagrece, ${NOME_LOWER} reclame aqui"
  schemaType="home"
  schemaHowTo={[${howToSchema}
  ]}
  schemaFaq={[${faqSchema}
  ]}
>
  <Navigation />

  <main class="pt-[72px]">
    <!-- HERO -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-brand/5 via-surface to-brand-light/5"></div>
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px] animate-orb"></div>
      <div class="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-orb animate-orb-delay"></div>

      <div class="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
          ${P.categoria}
        </span>

        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-10">
          <em class="text-brand">${NOME_CAP} Funciona?</em> Análise 2026 — ${P.dosagem}
        </h1>
        <p class="text-xl md:text-2xl text-brand-dark/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          ${NOME_CAP} em ${FORMATO_PLURAL}: a fórmula natural que já ajudou mais de <strong>${P.socialProofNumero} ${P.socialProofTexto}</strong> a recuperarem a autoestima. Só <strong>${P.dosagem}</strong> + ${P.bonusApp} + ${P.bonusEbooks}.
        </p>

        <p class="text-base md:text-lg text-brand-dark/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Se você evita espelhos e já tentou de tudo — descubra por que ${P.dosagem} pode ser o que faltava para o metabolismo reagir, sem dietas malucas.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="#onde-comprar"
            class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-4 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Garantir Meu Kit com 40% OFF
          </a>
          <a
            href="#o-que-e"
            class="inline-flex items-center gap-2 text-base font-medium text-brand border-2 border-brand px-8 py-4 rounded-full hover:bg-brand hover:text-white transition-all"
          >
            Conhecer o Produto
          </a>
        </div>

        <p class="text-sm text-brand-dark/80 mb-10 max-w-xl mx-auto">
          <strong>🔥 Oferta por tempo limitado:</strong> Kit mais popular (3 potes) com 40% de desconto + Frete Grátis + ${P.bonusApp} + ${P.bonusEbooks}.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <span class="inline-flex items-center gap-2 text-sm text-brand-dark/80">
            <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            100% Natural
          </span>
          <span class="inline-flex items-center gap-2 text-sm text-brand-dark/80">
            <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Fórmula Exclusiva
          </span>
          <span class="inline-flex items-center gap-2 text-sm text-brand-dark/80">
            <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Garantia de Satisfação
          </span>
        </div>
      </div>
    </section>

    <!-- O QUE É -->
    <section id="o-que-e" class="py-24 lg:py-32">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Conhecendo o produto</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10">O que é o ${NOME_CAP}? Pra que Serve?</h2>

        <div class="prose prose-lg max-w-none text-brand-dark/80">
          <p class="text-lg leading-relaxed mb-6">
            O <strong>${NOME_CAP}</strong> é um suplemento alimentar natural em <strong>${FORMATO_PLURAL}</strong> (${P.volumeFrasco} por frasco), <strong>desenvolvido com fórmula exclusiva</strong> com ${P.quantidadeIngredientes} componentes ativos que trabalham em sinergia para acelerar o metabolismo, controlar o apetite e auxiliar na queima de gordura.
          </p>
          <p class="text-lg leading-relaxed mb-6">
            <strong>Pra que serve o ${NOME_CAP}?</strong> A fórmula exclusiva foi pensada para quem deseja emagrecer <strong>sem passar fome</strong> ou recorrer a dietas restritivas.
          </p>
          <p class="text-lg leading-relaxed mb-6">
            O uso é simples: apenas <strong>${P.dosagem}</strong>, preferencialmente no mesmo horário. E diferente de cápsulas, a apresentação em ${FORMATO_PLURAL} oferece absorção mais rápida e dosagem precisa.
          </p>
          <div class="bg-brand/5 border-l-4 border-brand p-5 rounded-r-xl mb-6">
            <h4 class="font-display text-lg font-bold text-brand-dark mb-2">🎁 Ecossistema ${NOME_CAP} incluso na compra oficial:</h4>
            <ul class="text-brand-dark/80 space-y-1 text-base">
              <li>📱 <strong>${P.bonusApp}</strong></li>
              <li>📚 <strong>${P.bonusEbooks}</strong></li>
              <li>👥 <strong>${P.bonusGrupo}</strong></li>
            </ul>
          </div>
        </div>

        <div class="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="/o-que-e/" class="inline-flex items-center gap-2 text-base font-medium text-brand hover:text-accent transition-colors">
            Ler análise completa sobre o que é o ${NOME_CAP} e para que serve →
          </a>
          <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-3 rounded-full hover:shadow-xl transition-all">
            Site oficial ${NOME_CAP} com desconto →
          </a>
        </div>
      </div>
    </section>

    <!-- COMPOSIÇÃO -->
    <section id="composicao" class="py-24 lg:py-32 bg-surface-alt/30">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Fórmula exclusiva</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10">Composição Natural: ${P.quantidadeIngredientes} Ingredientes em Sinergia</h2>

        <div class="prose prose-lg max-w-none text-brand-dark/80">
          <p class="text-lg leading-relaxed mb-6">
            A fórmula do ${NOME_CAP} combina ${P.quantidadeIngredientes} ingredientes naturais selecionados por especialistas. Cada componente foi escolhido para atuar em uma frente específica do emagrecimento saudável.
          </p>
        </div>

        <div class="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="/composicao/" class="inline-flex items-center gap-2 text-base font-medium text-brand hover:text-accent transition-colors">
            Ver composição completa com ação de cada ingrediente →
          </a>
          <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-3 rounded-full hover:shadow-xl transition-all">
            Comprar ${NOME_CAP} Original →
          </a>
        </div>
      </div>
    </section>

    <!-- BENEFÍCIOS -->
    <section id="beneficios" class="py-24 lg:py-32">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Resultados comprovados</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10">Benefícios do ${NOME_CAP}: Emagrece?</h2>

        <div class="prose prose-lg max-w-none text-brand-dark/80">
          <p class="text-lg leading-relaxed mb-6">
            O ${NOME_CAP} emagrece ao agir em três frentes simultâneas: ignição metabólica, limpeza interna e controle da compulsão alimentar.
          </p>
          <ul class="text-lg leading-relaxed mb-6">
            ${C.beneficios.itens.map(b => `<li><strong>${b.titulo}:</strong> ${b.resultadoPratico}</li>`).join('\n            ')}
          </ul>
        </div>

        <div class="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="/beneficios/" class="inline-flex items-center gap-2 text-base font-medium text-brand hover:text-accent transition-colors">
            Conhecer todos os benefícios com detalhes →
          </a>
          <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-3 rounded-full hover:shadow-xl transition-all">
            Garantir Meu Kit →
          </a>
        </div>
      </div>
    </section>

    <!-- COMO USAR -->
    <section id="como-usar" class="py-24 lg:py-32 bg-surface-alt/30">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Guia prático</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10">Como Usar o ${NOME_CAP}? Dosagem e Duração</h2>

        <div class="prose prose-lg max-w-none text-brand-dark/80">
          <p class="text-lg leading-relaxed mb-6">
            Usar o ${NOME_CAP} é simples: <strong>${P.dosagem}</strong>, preferencialmente no mesmo horário, combinadas com água.
          </p>
          <p class="text-lg leading-relaxed mb-6">
            Para resultados consistentes, recomenda-se o uso por pelo menos 90 dias (3 frascos). Os primeiros sinais de saciedade costumam aparecer entre a 2ª e 4ª semana.
          </p>
        </div>

        <div class="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="/como-usar/" class="inline-flex items-center gap-2 text-base font-medium text-brand hover:text-accent transition-colors">
            Ver guia completo de como usar →
          </a>
          <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-3 rounded-full hover:shadow-xl transition-all">
            Comprar com Desconto →
          </a>
        </div>
      </div>
    </section>

    <!-- DEPOIMENTOS -->
    <section id="depoimentos" class="py-24 lg:py-32">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Prova social</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10">Depoimentos: Resultados Reais de Quem Usou ${NOME_CAP}</h2>

        <div class="grid md:grid-cols-2 gap-8 mb-12">
          ${C.depoimentos.slice(0, 4).map(d => `
          <div class="bg-surface-alt p-6 rounded-2xl border border-brand/5">
            <blockquote class="text-brand-dark/80 text-base leading-relaxed mb-4">
              "${d.texto.substring(0, 120)}..."
            </blockquote>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-lg">👤</div>
              <div>
                <p class="font-semibold text-brand-dark text-sm">${d.nome}</p>
                <p class="text-xs text-brand-dark/60">${d.idade} anos, ${d.cidade} — ${d.tempoUso}</p>
              </div>
            </div>
          </div>`).join('')}
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="/depoimentos/" class="inline-flex items-center gap-2 text-base font-medium text-brand hover:text-accent transition-colors">
            Ver todos os depoimentos e fotos →
          </a>
          <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-3 rounded-full hover:shadow-xl transition-all">
            Quero Resultados Assim →
          </a>
        </div>
      </div>
    </section>

    <!-- ANTES E DEPOIS -->
    <section class="py-24 lg:py-32 bg-surface-alt/30">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Transformação</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10">Antes e Depois</h2>

        <div class="grid md:grid-cols-3 gap-6 mb-10">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand/5">
            <img src="/images/antes-depois-1.jpg" alt="Antes e depois ${NOME_CAP}" class="w-full h-64 object-cover" loading="lazy" />
            <div class="p-4 text-left">
              <p class="font-semibold text-brand-dark text-sm">${C.depoimentos[0]?.nome || 'Cliente 1'}</p>
              <p class="text-xs text-brand-dark/60">${C.depoimentos[0]?.tempoUso || '3 meses'} de uso</p>
            </div>
          </div>
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand/5">
            <img src="/images/antes-depois-2.jpg" alt="Antes e depois ${NOME_CAP}" class="w-full h-64 object-cover" loading="lazy" />
            <div class="p-4 text-left">
              <p class="font-semibold text-brand-dark text-sm">${C.depoimentos[1]?.nome || 'Cliente 2'}</p>
              <p class="text-xs text-brand-dark/60">${C.depoimentos[1]?.tempoUso || '3 meses'} de uso</p>
            </div>
          </div>
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand/5">
            <img src="/images/antes-depois-3.jpg" alt="Antes e depois ${NOME_CAP}" class="w-full h-64 object-cover" loading="lazy" />
            <div class="p-4 text-left">
              <p class="font-semibold text-brand-dark text-sm">${C.depoimentos[2]?.nome || 'Cliente 3'}</p>
              <p class="text-xs text-brand-dark/60">${C.depoimentos[2]?.tempoUso || '3 meses'} de uso</p>
            </div>
          </div>
        </div>

        <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-8 py-4 rounded-full hover:shadow-xl transition-all">
          Começar Minha Transformação →
        </a>
      </div>
    </section>

    <!-- ONDE COMPRAR -->
    <section id="onde-comprar" class="py-24 lg:py-32">
      <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
        <span class="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Compra segura</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-6 text-center">Onde Comprar ${NOME_CAP} Original com Desconto?</h2>
        <p class="text-lg text-brand-dark/70 text-center max-w-2xl mx-auto mb-16">
          Atenção: o ${NOME_CAP} original <strong>só é vendido no site oficial</strong>. Não arrisque sua saúde com produtos falsificados em marketplaces.
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <!-- Kit 1 -->
          <div class="bg-white rounded-2xl p-6 border border-brand/10 shadow-sm flex flex-col">
            <h3 class="font-display text-lg font-bold text-brand-dark mb-2">1 Frasco</h3>
            <p class="text-sm text-brand-dark/60 mb-4">30 dias de tratamento</p>
            <p class="text-2xl font-bold text-brand mb-1">12x <span class="text-brand">R$ ${P.precoParcelado1}</span></p>
            <p class="text-sm text-brand-dark/50 mb-6">à vista R$ ${P.precoAvista1}</p>
            <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full hover:shadow-xl transition-all">
              Comprar →
            </a>
          </div>

          <!-- Kit 3 (Popular) -->
          <div class="bg-white rounded-2xl p-6 border-2 border-accent shadow-lg flex flex-col relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">Mais Popular</span>
            <h3 class="font-display text-lg font-bold text-brand-dark mb-2">3 Frascos</h3>
            <p class="text-sm text-brand-dark/60 mb-4">90 dias — Leve 3 Pague 2</p>
            <p class="text-2xl font-bold text-brand mb-1">12x <span class="text-accent">R$ ${P.precoParcelado3}</span></p>
            <p class="text-sm text-brand-dark/50 mb-2">à vista R$ ${P.precoPopular}</p>
            <p class="text-xs text-success font-semibold mb-6">Economia de R$ 210,00</p>
            <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full hover:shadow-xl transition-all">
              Comprar →
            </a>
          </div>

          <!-- Kit 5 -->
          <div class="bg-white rounded-2xl p-6 border border-brand/10 shadow-sm flex flex-col">
            <h3 class="font-display text-lg font-bold text-brand-dark mb-2">5 Frascos</h3>
            <p class="text-sm text-brand-dark/60 mb-4">150 dias — Kit Família</p>
            <p class="text-2xl font-bold text-brand mb-1">12x <span class="text-brand">R$ ${P.precoParcelado5}</span></p>
            <p class="text-sm text-brand-dark/50 mb-6">à vista R$ ${P.precoAvista5}</p>
            <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full hover:shadow-xl transition-all">
              Comprar →
            </a>
          </div>

          <!-- Kit 8 -->
          <div class="bg-white rounded-2xl p-6 border border-brand/10 shadow-sm flex flex-col">
            <h3 class="font-display text-lg font-bold text-brand-dark mb-2">8 Frascos</h3>
            <p class="text-sm text-brand-dark/60 mb-4">240 dias — Transformação Total</p>
            <p class="text-2xl font-bold text-brand mb-1">12x <span class="text-brand">R$ ${P.precoParcelado8}</span></p>
            <p class="text-sm text-brand-dark/50 mb-6">à vista R$ ${P.precoAvista8}</p>
            <a href="${P.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light px-6 py-3 rounded-full hover:shadow-xl transition-all">
              Comprar →
            </a>
          </div>
        </div>

        <!-- Garantia -->
        <div class="bg-surface-alt rounded-2xl p-8 border border-brand/5 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success text-3xl mb-4">🛡️</div>
          <h3 class="font-display text-2xl font-bold text-brand-dark mb-2">Garantia Incondicional de ${P.tempoGarantiaDias} Dias</h3>
          <p class="text-brand-dark/70 max-w-2xl mx-auto">
            Você tem ${P.tempoGarantiaDias} dias para testar o ${NOME_CAP}. Se não sentir resultados, devolvemos 100% do seu dinheiro. Sem burocracia, sem perguntas.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ (Schema) -->
    <section class="py-24 lg:py-32 bg-surface-alt/30">
      <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-10 text-center">Perguntas Frequentes</h2>

        <div class="space-y-4">
          ${C.faq.map(f => `
          <details class="bg-white rounded-xl border border-brand/10 p-5 group">
            <summary class="font-semibold text-brand-dark cursor-pointer list-none flex items-center justify-between">
              ${f.pergunta}
              <span class="text-accent group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p class="text-brand-dark/70 mt-4 leading-relaxed">${f.resposta}</p>
          </details>`).join('')}
        </div>
      </div>
    </section>
  </main>

  <Footer />
</Layout>
`;

writeFile(path.join(DEST_DIR, 'src', 'pages', 'index.astro'), indexContent);
console.log('✅ index.astro gerado.\n');

// =============================================================================
// 7. RENOMEAR mounjax-gotas.astro
// =============================================================================

const oldFocusPage = path.join(DEST_DIR, 'src', 'pages', 'mounjax-gotas.astro');
const newFocusPage = path.join(DEST_DIR, 'src', 'pages', `${SLUG}.astro`);
if (fs.existsSync(oldFocusPage)) {
  fs.renameSync(oldFocusPage, newFocusPage);
  console.log(`✅ Renomeado: mounjax-gotas.astro → ${SLUG}.astro\n`);
}

// =============================================================================
// 8. GERAR README
// =============================================================================

const readmeContent = `# ${P.siteName}

> ${P.tagline}

## 🚀 Deploy

\`\`\`bash
npm install
npm run build
\`\`\`

## 📁 Estrutura

- \`src/data/config.ts\` — Central de dados do produto
- \`src/content/pages/\` — Páginas de review (o-que-e, composicao, beneficios, etc.)
- \`src/pages/index.astro\` — Landing page
- \`public/images/\` — Imagens do produto e antes/depois

## ⚠️ Importante

Substitua as imagens em \`public/images/\` antes do deploy:
- logo.png
- produto.jpg
- og-default.jpg
- og-*.jpg (7 imagens)
- antes-depois-1.jpg até 5.jpg

---

Gerado automaticamente a partir do template de site review de nutracêuticos.
`;

writeFile(path.join(DEST_DIR, 'README.md'), readmeContent);

// =============================================================================
// 9. ATUALIZAR package.json
// =============================================================================

const pkgPath = path.join(DEST_DIR, 'package.json');
const pkg = JSON.parse(readFile(pkgPath));
pkg.name = SLUG;
writeFile(pkgPath, JSON.stringify(pkg, null, 2));

// =============================================================================
// FIM
// =============================================================================

console.log('==============================================');
console.log(`✅ SITE GERADO COM SUCESSO: ${NOME_CAP}`);
console.log('==============================================');
console.log(`\n📁 Pasta: ${DEST_DIR}`);
console.log('\n🔧 PRÓXIMOS PASSOS:');
console.log('   1. Copie suas imagens para public/images/');
console.log('   2. Rode: npm install');
console.log('   3. Rode: npm run build');
console.log('   4. Verifique se gerou 16 páginas em dist/');
console.log('   5. Faça deploy no Vercel\n');
