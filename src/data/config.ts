/**
 * CENTRAL DE DADOS — CÉREBRO DO SITE
 * Todas as informações globais do blogozenvitta.com.br
 */

export const SITE_CONFIG = {
  // Domínio e identidade
  domain: 'https://portalozenvitta.vercel.app',
  siteName: 'Blog Ozenvitta',
  tagline: 'Análise Independente do Suplemento Ozenvitta',
  language: 'pt-BR',
  locale: 'pt_BR',

  // SEO Defaults
  titleDefault: 'Ozenvitta Funciona? Análise 2026 — 2 cápsulas por dia',
  descriptionDefault:
    'Ozenvitta em cápsulas: 2 cápsulas por dia, 13 ingredientes naturais. Veja preços, kits com até 40% OFF e garantia de 30 dias.',
  keywordsDefault:
    'ozenvitta funciona, ozenvitta funciona mesmo, o que é ozenvitta, pra que serve o ozenvitta, ozenvitta preço, ozenvitta valor, ozenvitta para emagrecer, ozenvitta para que serve, ozenvitta cápsulas, ozenvitta em cápsulas, ozenvitta emagrece, ozenvitta reclame aqui, ozenvitta onde comprar, ozenvitta desconto',

  // Branding & E-E-A-T
  author: {
    name: 'Blog Ozenvitta',
    role: 'Especialistas em Suplemento Alimentar em Cápsulas',
    email: 'contato@portalozenvitta.com.br',
    since: '2025',
  },

  // Autor especialista para schemas Article (Person)
  expert: {
    name: 'Dra. Carla Mendonça',
    jobTitle: 'Nutricionista Funcional e Especialista em Suplementação Natural',
    url: 'https://portalozenvitta.vercel.app/sobre-nos/',
    description:
      'Nutricionista funcional com mais de 12 anos de experiência em suplementação natural e emagrecimento saudável.',
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
    name: 'Ozenvitta',
    brand: 'Ozenvitta',
    category: 'Suplemento Alimentar em Cápsulas',
    officialUrl: 'https://ozenvitta.com',
    affiliateLink: 'https://app.monetizze.com.br/r/AXC25796271',
    price: '197.00',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    sku: 'OZENVITTA-60CAP',
    image: 'https://portalozenvitta.vercel.app/images/produto.jpg',
    aggregateRating: {
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '2157',
    },
  },

  // Afiliados & Disclaimer
  affiliate: {
    disclaimer:
      'Este site contém links de afiliados via Monetizze. Ao comprar por nossos links, podemos receber uma comissão, sem custo adicional para você.',
    partner: 'Ozenvitta — Programa de Afiliados Monetizze',
  },

  // Performance & SEO
  ogImage: 'https://portalozenvitta.vercel.app/images/og-default.jpg',
  twitterHandle: '',
  themeColor: '#1e3a8a',
} as const;

export type SiteConfig = typeof SITE_CONFIG;
