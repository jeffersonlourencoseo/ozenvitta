/**
 * CENTRAL DE DADOS — CÉREBRO DO SITE
 * Todas as informações globais do blogozenvitta.com.br
 */

export const SITE_CONFIG = {
  // Domínio e identidade
  domain: 'https://portalozenvitta.com.br',
  siteName: 'Blog Ozenvitta',
  tagline: 'Análise Independente do Suplemento Ozenvitta',
  language: 'pt-BR',
  locale: 'pt_BR',

  // SEO Defaults
  titleDefault: 'Ozenvitta Funciona? Análise 2026 — 2 Cápsulas/Dia',
  descriptionDefault:
    'Ozenvitta em cápsulas: 2 cápsulas por dia, 9 ingredientes naturais, App com aulas e e-books de bônus. Veja preços, kits com até 40% OFF e garantia de 30 dias.',
  keywordsDefault:
    'ozenvitta funciona, ozenvitta funciona mesmo, o que é ozenvitta, pra que serve o ozenvitta, ozenvitta preço, ozenvitta valor, ozenvitta para emagrecer, ozenvitta para que serve, ozenvitta cápsulas, ozenvitta em cápsulas, ozenvitta emagrece, ozenvitta reclame aqui, ozenvitta onde comprar, ozenvitta desconto, ozenvitta ozenpharma',

  // Branding & E-E-A-T
  author: {
    name: 'Blog Ozenvitta',
    role: 'Especialistas em Suplementação Natural',
    email: 'contato@blogozenvitta.com.br',
    since: '2025',
  },

  // Autor especialista para schemas Article (Person)
  expert: {
    name: 'Dra. Ana Luiza Mendes',
    jobTitle: 'Nutricionista Funcional e Especialista em Suplementação Natural',
    url: 'https://portalozenvitta.com.br/sobre-nos/',
    description:
      'Nutricionista funcional com mais de 12 anos de experiência em suplementação natural, emagrecimento saudável e regulagem metabólica.',
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
    affiliateLink: 'https://app.monetizze.com.br/r/ATX25785612',
    price: '197.00',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    sku: 'OZENVITTA-60CAPS',
    image: 'https://portalozenvitta.com.br/images/ozenvitta-produto.jpg',
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
  ogImage: 'https://portalozenvitta.com.br/images/og-default.jpg',
  twitterHandle: '',
  themeColor: '#1B3A6B',
} as const;

export type SiteConfig = typeof SITE_CONFIG;
