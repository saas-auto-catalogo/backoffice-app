export type ArticleStatus = 'PENDING_APPROVAL' | 'PUBLISHED' | 'DRAFT' | 'REJECTED';

export type ArticleCategory =
  | 'META_ADS'
  | 'XML_FEEDS'
  | 'STOCK_MANAGEMENT'
  | 'LEAD_CONVERSION'
  | 'DEALERSHIP_MARKETING';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  category: ArticleCategory;
  seoScore: number;
  focusKeyword: string;
  metaDescription: string;
  wordCount: number;
  readingTimeMinutes: number;
  coverImageUrl: string;
  status: ArticleStatus;
  generatedByModel: string;
  createdAt: string;
  publishedAt?: string;
  rejectionReason?: string;
}

export interface BlogModerationMetrics {
  totalArticles: number;
  pendingCount: number;
  publishedCount: number;
  rejectedCount: number;
  avgSeoScore: number;
}
