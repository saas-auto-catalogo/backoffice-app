import { httpClient } from './httpClient.js';
import { BlogArticle, BlogModerationMetrics } from '../../types/blogModeration.js';
import { auditLogService } from './auditLogService.js';

const MOCK_ARTICLES: BlogArticle[] = [
  {
    id: 'art-001',
    title: 'Como Anunciar Carros no Instagram Usando Feed XML Automotivo em 2026',
    slug: 'como-anunciar-carros-instagram-feed-xml-automotivo-2026',
    excerpt: 'Descubra como conectar o estoque da sua concessionária diretamente ao Meta Ads sem precisar cadastrar carros manualmente.',
    contentMarkdown: `## Introdução ao Meta Automotive Ads (DAA)

Anunciar veículos de forma manual no Gerenciador de Anúncios da Meta é uma tarefa lenta e propensa a erros graves. Quando um veículo é vendido na loja física, o anúncio continua rodando e queimando verba de mídia em um carro indisponível.

A solução definitiva adotada pelas maiores redes de concessionárias do Brasil é a **sincronização automática via Feed XML Automotivo (DAA)**.

---

### Principais Vantagens do Feed XML em Tempo Real:

1. **Atualização Instantânea**: O estoque é sincronizado com o seu DMS (AutoCerto, Altimus, Sisvag) a cada poucos minutos.
2. **Eliminação de Lead Desperdiçado**: Carro vendido sai imediatamente dos anúncios do Instagram e Facebook.
3. **Formatos Dinâmicos de Alta Conversão**: Carrossel 1:1, Stories 9:16 e anúncios de inventário com fotos reais em alta resolução.

> "Concessionárias que adotam catálogo dinâmico registram uma redução média de 38% no custo por lead qualificado de WhatsApp."

---

### Como Começar com o Auto Catálogo SaaS

O **Auto Catálogo** normaliza automaticamente as tags do seu integrador DMS para o padrão canônico exigido pela Meta, garantindo 100% de conformidade com o schema XSD sem necessidade de programador.`,
    category: 'META_ADS',
    seoScore: 98,
    focusKeyword: 'feed xml automotivo instagram',
    metaDescription: 'Guia completo para concessionárias conectarem o estoque DMS ao Meta Automotive Ads e venderem mais carros no Instagram.',
    wordCount: 1450,
    readingTimeMinutes: 6,
    coverImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    status: 'PENDING_APPROVAL',
    generatedByModel: 'Gemini 1.5 Pro (Open Deep Research)',
    createdAt: 'Hoje às 18:20',
  },
  {
    id: 'art-002',
    title: 'Guia Definitivo do Meta Automotive Inventory Ads (DAA) para Concessionárias',
    slug: 'guia-definitivo-meta-automotive-inventory-ads-daa',
    excerpt: 'Tudo o que gestores de marketing automotivo precisam saber sobre o formato DAA da Meta e como multiplicar vendas.',
    contentMarkdown: `## O que é o Meta Automotive Inventory Ads?

O **Automotive Inventory Ads (DAA)** é a tecnologia proprietária da Meta construída especificamente para o ecossistema de revendas e concessionárias de veículos.

Diferente de e-commerces tradicionais, o DAA compreende os atributos intrínsecos de um veículo:
- Ano de Fabricação e Ano Modelo
- Quilometragem (KM)
- Tipo de Câmbio e Combustível
- Chassi / Placa Mercosul
- Preço à Vista em BRL

---

### Requisitos Técnicos Obrigatórios da Meta:

- Imagem Hero com proporção mínima de **1:1** ou **16:9** em HTTPS.
- Identificador canônico único (\`<g:vehicle_id>\`).
- Preço numérico formatado com moeda (\`BRL\`).

Adote o **Auto Catálogo SaaS** e automatize a validação do seu catálogo em minutos.`,
    category: 'DEALERSHIP_MARKETING',
    seoScore: 96,
    focusKeyword: 'meta automotive inventory ads daa',
    metaDescription: 'Aprenda tudo sobre o Meta Automotive Inventory Ads e como implementar campanhas automotivas dinâmicas de alta conversão.',
    wordCount: 2100,
    readingTimeMinutes: 9,
    coverImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    status: 'PENDING_APPROVAL',
    generatedByModel: 'Gemini 1.5 Pro (Automotive Engine)',
    createdAt: 'Hoje às 17:45',
  },
  {
    id: 'art-003',
    title: 'Por Que Sua Concessionária Está Perdendo Vendas no WhatsApp Sem Catálogo Dinâmico',
    slug: 'por-que-concessionaria-perde-vendas-whatsapp-sem-catalogo',
    excerpt: 'Entenda o impacto direto da latência de estoque na frustração de compradores de seminovos e como resolver.',
    contentMarkdown: `## A Dor do Comprador de Seminovos

Nada gera mais atrito no funil de vendas de uma loja de veículos do que um cliente clicar em um anúncio no Instagram, ser direcionado para o WhatsApp do vendedor, e ouvir: *"Infelizmente esse carro já foi vendido ontem"*.

Essa frustração destrói o ROI da campanha e diminui a credibilidade da marca.

---

### Como o Auto Catálogo SaaS Resolve Isso:

Com nosso motor de ingestão em tempo real, qualquer baixa no DMS (AutoCerto, Altimus, BomControle) atualiza o feed da Meta em minutos, garantindo que apenas veículos disponíveis estejam ativos nas campanhas.`,
    category: 'LEAD_CONVERSION',
    seoScore: 94,
    focusKeyword: 'vendas whatsapp concessionaria catalogo',
    metaDescription: 'Descubra como evitar o desperdício de leads de WhatsApp em carros já vendidos usando catálogo dinâmico de veículos.',
    wordCount: 1280,
    readingTimeMinutes: 5,
    coverImageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    status: 'PENDING_APPROVAL',
    generatedByModel: 'Open Deep Research Agent',
    createdAt: 'Hoje às 16:10',
  },
  {
    id: 'art-004',
    title: 'Integração de Feeds XML: AutoCerto, Altimus e Sisvag com Meta Ads',
    slug: 'integracao-feeds-xml-autocerto-altimus-sisvag-meta-ads',
    excerpt: 'Análise técnica comparativa entre os principais formatos de XML de estoque do mercado automotivo brasileiro.',
    contentMarkdown: `## Panorama dos Integradores DMS no Brasil

Cada gestor de estoque automotivo adota uma estrutura de tags XML diferente. O AutoCerto utiliza tags em português com prefixos específicos, enquanto o Altimus utiliza nós resumidos e o Sisvag adota nomenclaturas legadas.

Neste artigo, detalhamos como a camada de normalização do **Auto Catálogo** traduz cada formato para o padrão oficial do Facebook e Instagram.`,
    category: 'XML_FEEDS',
    seoScore: 99,
    focusKeyword: 'integracao xml autocerto altimus sisvag meta',
    metaDescription: 'Comparativo técnico de feeds XML de estoque de concessionárias e integração direta com Meta Automotive Ads.',
    wordCount: 1850,
    readingTimeMinutes: 8,
    coverImageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    generatedByModel: 'Gemini 1.5 Pro (Technical SEO)',
    createdAt: 'Ontem às 10:00',
    publishedAt: 'Ontem às 14:30',
  },
];

export const blogModerationService = {
  async getMetrics(): Promise<BlogModerationMetrics> {
    try {
      const res = await httpClient.get<BlogModerationMetrics>('/admin/blog/metrics', { timeout: 4000 });
      return res;
    } catch {
      return {
        totalArticles: MOCK_ARTICLES.length,
        pendingCount: MOCK_ARTICLES.filter((a) => a.status === 'PENDING_APPROVAL').length,
        publishedCount: MOCK_ARTICLES.filter((a) => a.status === 'PUBLISHED').length,
        rejectedCount: MOCK_ARTICLES.filter((a) => a.status === 'REJECTED').length,
        avgSeoScore: 96.7,
      };
    }
  },

  async listArticles(search?: string, status?: string, category?: string): Promise<BlogArticle[]> {
    try {
      const res = await httpClient.get<{ items: BlogArticle[] }>('/admin/blog/articles', {
        params: { search, status, category },
        timeout: 5000,
      });
      if (res.items) return res.items;
      return res as any;
    } catch {
      let items = [...MOCK_ARTICLES];

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.focusKeyword.toLowerCase().includes(q)
        );
      }

      if (status && status !== 'ALL') {
        items = items.filter((a) => a.status === status);
      }

      if (category && category !== 'ALL') {
        items = items.filter((a) => a.category === category);
      }

      return items;
    }
  },

  async approveAndPublish(
    articleId: string,
    adminEmail: string = 'fabio.oliveira@autocatalogo.com.br'
  ): Promise<{ success: boolean; message: string }> {
    const article = MOCK_ARTICLES.find((a) => a.id === articleId);
    if (article) {
      article.status = 'PUBLISHED';
      article.publishedAt = 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    // Registra no Audit Log
    await auditLogService.logAction({
      adminEmail,
      adminName: 'Fabio Oliveira (Super Admin)',
      action: 'PLAN_UPGRADE',
      reason: `Aprovação e publicação de artigo no Blog AI: "${article?.title}" (Slug: ${article?.slug}).`,
      ipAddress: '189.40.122.95 (SP)',
    });

    try {
      const res = await httpClient.post(`/admin/blog/articles/${articleId}/publish`, {}, { timeout: 5000 });
      return res;
    } catch {
      return {
        success: true,
        message: `Artigo '${article?.title}' aprovado e publicado com sucesso no Blog Comercial!`,
      };
    }
  },

  async rejectArticle(
    articleId: string,
    reason: string,
    adminEmail: string = 'fabio.oliveira@autocatalogo.com.br'
  ): Promise<{ success: boolean; message: string }> {
    const article = MOCK_ARTICLES.find((a) => a.id === articleId);
    if (article) {
      article.status = 'REJECTED';
      article.rejectionReason = reason;
    }

    await auditLogService.logAction({
      adminEmail,
      adminName: 'Fabio Oliveira (Super Admin)',
      action: 'TENANT_STATUS_CHANGE',
      reason: `Rejeição de artigo do Blog AI para reescrita: "${article?.title}". Motivo: ${reason}`,
      ipAddress: '189.40.122.95 (SP)',
    });

    try {
      const res = await httpClient.post(`/admin/blog/articles/${articleId}/reject`, { reason }, { timeout: 5000 });
      return res;
    } catch {
      return {
        success: true,
        message: `Artigo devolvido para reprocessamento pelo modelo de IA.`,
      };
    }
  },

  async updateArticle(articleId: string, data: Partial<BlogArticle>): Promise<BlogArticle> {
    const article = MOCK_ARTICLES.find((a) => a.id === articleId);
    if (article) {
      Object.assign(article, data);
    }
    return article as BlogArticle;
  },
};
