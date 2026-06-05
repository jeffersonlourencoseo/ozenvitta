# 🏗️ BLUEPRINT — Site Review de Produto (Astro + Tailwind)

> **Template completo para criar sites de review afiliado de produtos (suplementos, nutracêuticos, cosméticos, etc.)**
>
> Baseado no projeto Mounjax (Blog Mounjax Review) — projeto validado com build, SEO e performance otimizados.

---

## 📁 Estrutura de Pastas

```
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── produto.jpg                 # Foto do produto
│   │   ├── og-default.jpg              # Open Graph padrão
│   │   ├── og-{slug}.jpg (7x)          # OG por página
│   │   ├── antes-depois-1.jpg          # Fotos antes/depois
│   │   ├── antes-depois-2.jpg
│   │   ├── antes-depois-3.jpg
│   │   ├── antes-depois-4.png
│   │   ├── antes-depois-5.jpg
│   │   └── ...
│   ├── fonts/
│   │   ├── inter-latin-400-normal.woff2
│   │   ├── inter-latin-600-normal.woff2
│   │   ├── cormorant-garamond-latin-700-normal.woff2
│   │   └── fonts-deferred.css          # Fontes não-críticas
│   ├── favicon.svg / favicon.ico
│   ├── apple-touch-icon.png
│   ├── sitemap.xml / sitemap-index.xml  # Gerados no postbuild
│   └── llms.txt / pricing.md           # Opcional (SEO LLM)
├── scripts/
│   ├── generate-sitemap.js              # Gera sitemap.xml
│   └── async-css-postbuild.js           # Transforma CSS em async
├── src/
│   ├── content/
│   │   ├── pages/
│   │   │   ├── o-que-e.md
│   │   │   ├── composicao.md
│   │   │   ├── beneficios.md
│   │   │   ├── como-usar.md
│   │   │   ├── contraindicacoes.md
│   │   │   ├── depoimentos.md
│   │   │   └── onde-comprar.md
│   │   └── config.ts
│   ├── data/
│   │   └── config.ts                    # Central de dados do site
│   ├── layouts/
│   │   └── Layout.astro                 # Layout base com SEO + Schema
│   ├── components/
│   │   ├── SEO.astro                    # Meta tags + OG + GTag deferido
│   │   ├── SchemaMarkup.astro           # JSON-LD (Organization, Product, FAQ, etc.)
│   │   ├── Navigation.astro             # Menu fixo + mobile
│   │   └── Footer.astro
│   └── pages/
│       ├── index.astro                  # Landing page completa
│       ├── [slug].astro                 # Template de artigos internos
│       ├── sobre-nos.astro
│       ├── contato.astro
│       ├── reclame-aqui.astro
│       ├── mounjax-gotas.astro          # Página de foco (ex: nome-do-produto-gotas)
│       ├── politica-de-privacidade.astro
│       ├── politica-de-cookies.astro
│       ├── termos-de-uso.astro
│       └── 404.astro
```

---

## 🧠 Central de Dados (`src/data/config.ts`)

Tudo que muda de produto para produto está aqui. **É o único arquivo obrigatório a editar.**

```typescript
export const SITE_CONFIG = {
  domain: 'https://seusite.vercel.app',
  siteName: 'Blog [Produto]',
  tagline: 'Análise Independente do [Produto]',
  language: 'pt-BR',
  locale: 'pt_BR',

  // SEO Defaults
  titleDefault: '[Produto] Funciona? Análise 2026 — [Dose]',
  descriptionDefault: '[Produto] em gotas: [dose] por dia, [X] ingredientes naturais...',
  keywordsDefault: '[produto] funciona, [produto] funciona mesmo, o que é [produto]...',

  // E-E-A-T
  author: {
    name: 'Blog [Produto]',
    role: 'Especialistas em [Categoria]',
    email: 'contato@blog[produto].com.br',
    since: '2025',
  },

  // Autor especialista para schemas Article (Person)
  expert: {
    name: 'Dra. [Nome] [Sobrenome]',
    jobTitle: 'Nutricionista Funcional e Especialista em [Categoria]',
    url: 'https://seusite.vercel.app/sobre-nos/',
    description: 'Profissional com mais de 12 anos de experiência...',
  },

  // Produto review
  product: {
    name: '[Produto]',
    brand: '[Produto]',           // Nome da marca (ex: Mounjax)
    category: 'Suplemento Alimentar em Gotas',
    officialUrl: 'https://siteoficial.com',
    affiliateLink: 'https://app.monetizze.com.br/r/SEU_CODIGO',
    price: '197.00',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    sku: 'PRODUTO-30ML-GOTAS',
    image: 'https://seusite.vercel.app/images/produto.jpg',
    aggregateRating: {
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '2157',
    },
  },

  // Afiliados & Disclaimer
  affiliate: {
    disclaimer: 'Este site contém links de afiliados via Monetizze...',
    partner: '[Produto] — Programa de Afiliados Monetizze',
  },

  ogImage: 'https://seusite.vercel.app/images/og-default.jpg',
  themeColor: '#513F7E',   // Cor principal da marca
};
```

---

## 🏠 Estrutura da Home (`index.astro`)

A home é uma **landing page longa** com todas as seções inline. Não usa Markdown.

### Seções obrigatórias (em ordem):

| # | Seção | O que incluir | CTA |
|---|---|---|---|
| 1 | **Hero** | H1 com pergunta emocional, subheadline com prova social (número de pessoas), badge de urgência | 2 botões: "Comprar com desconto" + "Conhecer o Produto" |
| 2 | **O que é** | Resumo do produto, dosagem, formato (gotas/cápsulas), bônus inclusos | CTA inline + link para página interna |
| 3 | **Composição** | 3-6 ingredientes principais em cards visuais | CTA inline + link para página interna |
| 4 | **Benefícios** | 3-5 benefícios em cards com emoji + resultado prático | CTA inline + link para página interna |
| 5 | **Como Usar** | Passo a passo simples (3 passos), dosagem, duração | CTA inline + link para página interna |
| 6 | **Depoimentos** | 3-5 depoimentos com nome, idade, tempo de uso, resultados | CTA após depoimentos |
| 7 | **Antes e Depois** | Grid de 3 fotos reais com legenda (nome, tempo, kit) | CTA abaixo das fotos |
| 8 | **Onde Comprar** | Preços em cards: **parcelado em destaque grande**, à vista em cinza pequeno. Kits: 1, 3, 5, 8 frascos. Botão CTA em cada card. | CTA principal + aviso anti-golpe |
| 9 | **Garantia** | Badge de 30 dias, selos de segurança (SSL, Monetizze) | CTA |
| 10 | **FAQ** | 6-8 perguntas em `<details>`: funciona?, emagrece?, pra que serve?, tempo de efeito, efeitos colaterais, preço, onde comprar, Anvisa | CTA fixo no final |

### Regras de CTA na Home:
- **Mínimo 6 CTAs** espalhados por toda a página
- Todo botão de compra deve ter texto: `Site oficial [Produto] com desconto →`
- CTA sticky no mobile: `Comprar com Desconto`

---

## 📄 Estrutura das Páginas Internas (`.md` + `[slug].astro`)

Cada página interna é um arquivo `.md` na pasta `src/content/pages/`. Renderizado por `[slug].astro`.

### Páginas obrigatórias:

| Página | Objetivo | CTAs |
|---|---|---|
| **o-que-e.md** | Explicar o produto, formato, dosagem, bônus, ecossistema | 4 CTAs (início, 1/3, 1/2, final) |
| **composicao.md** | Detalhar cada ingrediente com emoji, ação científica | 4 CTAs + tabela de sinergia |
| **beneficios.md** | 5 benefícios com prova emocional + timeline de resultados | 4 CTAs + fotos antes/depois |
| **como-usar.md** | Dosagem, horário, duração, dicas, expectativas mês a mês | 4 CTAs + tabela de timeline |
| **contraindicacoes.md** | Quem não pode usar, interações, efeitos colaterais, gravidez | 3-4 CTAs + tabelas |
| **depoimentos.md** | 5 depoimentos em blockquote + fotos antes/depois + timeline | 3-4 CTAs |
| **onde-comprar.md** | Preços (parcelado grande, à vista pequeno), kits, bônus, garantia | 4 CTAs + botão em cada card de preço |

### Frontmatter padrão de cada `.md`:

```yaml
---
title: "Benefícios do [Produto]: Emagrece? Veja os 5 Principais"
description: "Descubra se o [Produto] emagrece de verdade..."
keywords: "[produto] beneficios, [produto] emagrece..."
order: 3          # Ordem no menu
navLabel: "Benefícios"
---
```

### Regras de formatação no `.md` (HTML inline permitido):

- **Nunca usar `prose`** — usar CSS customizado `.article-content`
- Títulos com **emoji**: `## 🔥 1. Nome do Benefício`
- **CTAs** em `<div style="text-align:center;...">` com botão vermelho (`#e74c3c`)
- **Tabelas** para comparações, timelines, preços
- **Blockquotes** para depoimentos ou destaques
- **Listas** com bullets naturais (`-`)
- **Texto emocional** antes do técnico

### CTA padrão inline (copiar e colar em cada `.md`):

```html
<div style="text-align:center;margin:2rem 0;">
  <a href="LINK_AFILIADO"
     target="_blank"
     rel="noopener noreferrer nofollow sponsored"
     style="display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#fff;background:#e74c3c;padding:1rem 2rem;border-radius:9999px;text-decoration:none;font-size:0.95rem;"
  >
    Site oficial [Produto] com desconto →
  </a>
  <p style="font-size:0.85rem;color:rgba(26,26,46,0.6);margin-top:0.75rem;">
    Frete Grátis | Garantia 30 Dias | 12x no cartão
  </p>
</div>
```

---

## 🎨 CSS Customizado para Artigos (`[slug].astro`)

No `<style is:global>` do `[slug].astro`, sempre manter estas regras:

```css
.article-content h2 { font-size: 1.75rem; border-bottom: 2px solid rgba(45,156,219,0.15); }
.article-content h3 { font-size: 1.35rem; }
.article-content h4 { font-size: 1.15rem; }
.article-content p { font-size: 1.05rem; line-height: 1.8; }
.article-content li::marker { color: #2d9cdb; }
.article-content blockquote { background: #f8f7f5; border-left: 4px solid #2d9cdb; }
.article-content th { background: rgba(45,156,219,0.08); }
.article-content p:empty { display: none; }  /* ESSENCIAL */
```

---

## 🔍 SEO Técnico

### Meta Tags (por página)

- **Title:** `[Título Descritivo] | Blog [Produto]`
- **Description:** Única, com CTA implícita, 150-160 caracteres
- **Keywords:** 12-15 variações de busca do Google
- **Canonical:** Sempre presente
- **Robots:** `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- **OG:** title, description, url, image, type, locale
- **Twitter Card:** `summary_large_image`

### Schemas JSON-LD (obrigatórios em todas as páginas)

| Schema | Onde | Dados |
|---|---|---|
| `Organization` | Todas | name, logo, url, email |
| `WebSite` | Todas | name, url, description |
| `BreadcrumbList` | Todas | navegação hierárquica |
| `Product` | Home + Onde Comprar | name, sku, price, rating, review |
| `Review` | Home + Depoimentos | author (Person), reviewBody, rating |
| `FAQPage` | Home + Reclame Aqui | 6-8 Q&A |
| `HowTo` | Home + Como Usar | 3 passos (dosagem, tomar, duração) |
| `Article` | Páginas internas | author, publishedTime, modifiedTime |

### Sitemap (`scripts/generate-sitemap.js`)

- 15 rotas
- Prioridades: Home=1.0, Artigos=0.9, Legal=0.3
- `lastmod` atualizado para data do deploy
- `changefreq` adequado (weekly para home/compra, monthly para artigos)

---

## ⚡ Performance (Otimizações que Funcionam)

| Otimização | Arquivo | Status |
|---|---|---|
| CSS do Tailwind carrega **assíncrono** (preload+onload) | `scripts/async-css-postbuild.js` | ✅ Obrigatório |
| GTag carrega **após first paint** (requestIdleCallback) | `src/components/SEO.astro` | ✅ Obrigatório |
| `preconnect` + `dns-prefetch` para GTM e Analytics | `src/components/SEO.astro` | ✅ Obrigatório |
| Fontes críticas inline (3 variantes) + deferred CSS | `src/layouts/Layout.astro` | ✅ Obrigatório |
| Schema JSON-LD movido para **final do `<body>`** | `src/layouts/Layout.astro` | ✅ Obrigatório |
| `p:empty {display:none}` para limpar espaços | `[slug].astro` | ✅ Obrigatório |

### O que NÃO fazer (já testamos e piorou):

| ❌ Inline de TODO o CSS do Tailwind no HTML | Caiu de 85 para 75 |
| ❌ Remover preconnect para o próprio domínio | Ganho marginal |
| ❌ Inline de imagens OG no HTML | Aumenta payload |

---

## 🖼️ Imagens e Prova Social

### Fotos obrigatórias:

| Arquivo | Uso |
|---|---|
| `logo.png` | Header, OG fallback, Schema Organization |
| `produto.jpg` | Hero, Schema Product, cards de preço |
| `og-default.jpg` | Open Graph padrão (1200x630) |
| `og-{slug}.jpg` (7x) | OG por página interna |
| `antes-depois-1.jpg` a `5.jpg` | Home + Depoimentos + Benefícios |

### Regras de Antes e Depois:
- Home: usar fotos 1, 2, 3
- Depoimentos: usar fotos 1, 2, 3
- Benefícios: usar fotos 4, 5 (nunca repetir)
- Legendas sempre com: nome fictício, idade, tempo de uso, kit usado

---

## 📝 Checklist de Personalização para Novo Produto

Antes de buildar e deployar, conferir cada item:

### [ ] 1. Dados do Produto (`config.ts`)
- [ ] Nome do produto substituído em todos os campos
- [ ] SKU do produto
- [ ] Link de afiliado Monetizze (ou Hotmart/EDUZZ)
- [ ] Preço do kit mais popular
- [ ] Cor da marca (`themeColor`)
- [ ] Domínio do site

### [ ] 2. SEO
- [ ] Titles e descriptions de todas as 7 páginas internas
- [ ] Keywords de busca do Google (mínimo 12)
- [ ] OG images criadas (1200x630) para cada página
- [ ] Favicon e apple-touch-icon

### [ ] 3. Copy
- [ ] Nome do produto não aparece junto a marca antiga
- [ ] Zero menções ao produto/fabricante anterior
- [ ] CTAs em todas as páginas (mínimo 3-4 por página)
- [ ] Texto do CTA: `Site oficial [Produto] com desconto →`
- [ ] Preços atualizados (parcelado em destaque, à vista pequeno)

### [ ] 4. Links
- [ ] Todos os links de afiliado apontam para o código correto
- [ ] Todos os links externos têm `target="_blank" rel="noopener noreferrer nofollow sponsored"`
- [ ] Nenhum link quebrado (testar build)

### [ ] 5. Imagens
- [ ] Fotos antes/depois renomeadas e colocadas em `public/images/`
- [ ] OG images geradas
- [ ] Logo substituído
- [ ] Foto do produto substituída

### [ ] 6. E-E-A-T (Credibilidade)
- [ ] Nome do especialista atualizado
- [ ] Email de contato do novo domínio
- [ ] Página Sobre Nós revisada
- [ ] Página Contato revisada

### [ ] 7. Performance
- [ ] `npm run build` sem erros
- [ ] 16 páginas geradas
- [ ] Sitemap gerado com 15 rotas
- [ ] Lighthouse score ≥ 85 (mobile)

### [ ] 8. Legal
- [ ] Termos de Uso atualizados
- [ ] Política de Privacidade atualizados
- [ ] Política de Cookies atualizada
- [ ] Disclaimer de afiliado presente no footer

---

## 🚀 Deploy

1. `npm run build`
2. `git add -A && git commit -m "Primeiro deploy" && git push origin master`
3. Vercel faz deploy automático
4. Rodar Lighthouse no PageSpeed Insights
5. Verificar se score ≥ 85
6. Submeter sitemap no Google Search Console

---

## 📊 Métricas de Sucesso

| Métrica | Meta Mínima | Meta Ideal |
|---|---|---|
| Lighthouse Mobile | 85+ | 90+ |
| Lighthouse Desktop | 95+ | 100 |
| Páginas indexadas | 15 | 15 |
| CTAs por página | 4 | 6-8 |
| Schemas JSON-LD | 6 tipos | 8 tipos |
| Fotos antes/depois | 5 | 8-10 |

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| Astro | 4.x | Framework SSG |
| Tailwind CSS | 3.x | Estilização |
| @fontsource/inter | 5.x | Fonte body |
| @fontsource/cormorant-garamond | 5.x | Fonte display (headings) |
| Google Tag Manager | — | Analytics (deferido) |
| Vercel | — | Hosting + CDN |

---

> **Última atualização:** 2026-06-01
>
> **Projeto de referência:** Blog Mounjax Review (mounjax-five.vercel.app)
>
> **Autor do blueprint:** Jefferson Lourenço
