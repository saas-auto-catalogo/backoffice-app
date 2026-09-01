import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  FileCheck2,
  Search,
  Sparkles,
  Check,
  X,
  Eye,
  RefreshCw
} from 'lucide-react';
import { BlogArticle } from '../../types/blogModeration.js';

export interface BlogModerationQueueProps {
  articles: BlogArticle[];
  onReviewArticle: (article: BlogArticle) => void;
  onQuickApprove: (article: BlogArticle) => void;
  onQuickReject: (article: BlogArticle) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function BlogModerationQueue({
  articles,
  onReviewArticle,
  onQuickApprove,
  onQuickReject,
  onRefresh,
  loading = false,
}: BlogModerationQueueProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredArticles = articles.filter((a) => {
    const q = search.toLowerCase();
    const matchQuery =
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.focusKeyword.toLowerCase().includes(q);

    if (!matchQuery) return false;
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;

    return true;
  });

  const getStatusBadge = (status: BlogArticle['status']) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <Badge variant="purple" size="sm" dot>
            Aguardando Aprovação
          </Badge>
        );
      case 'PUBLISHED':
        return (
          <Badge variant="available" size="sm" dot>
            Publicado no Blog
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="error" size="sm" dot>
            Rejeitado (Reescrita)
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            Rascunho
          </Badge>
        );
    }
  };

  const getCategoryLabel = (category: BlogArticle['category']) => {
    switch (category) {
      case 'META_ADS':
        return 'Meta Automotive Ads';
      case 'XML_FEEDS':
        return 'Feeds XML & DMS';
      case 'STOCK_MANAGEMENT':
        return 'Gestão de Estoque';
      case 'LEAD_CONVERSION':
        return 'Conversão de Leads';
      default:
        return 'Marketing Automotivo';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 bg-surface-muted/30">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-typography-heading">
              Central de Moderação de Conteúdo IA do Blog
            </h3>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs px-2 py-0.5 rounded-full">
              {filteredArticles.length} Artigos Encontrados
            </span>
          </div>
          <p className="text-xs text-typography-muted mt-0.5">
            Fluxo de aprovação em 1 clique para artigos gerados por IA com foco em SEO automotivo e atração de leads.
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-typography-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar título ou palavra-chave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-surface-border rounded-lg text-xs text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PENDING_APPROVAL">Aguardando Aprovação</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="REJECTED">Rejeitados</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="META_ADS">Meta Automotive Ads</option>
            <option value="XML_FEEDS">Feeds XML & DMS</option>
            <option value="LEAD_CONVERSION">Conversão de Leads</option>
            <option value="DEALERSHIP_MARKETING">Marketing Concessionária</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            onClick={onRefresh}
            loading={loading}
          >
            Atualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-surface-border text-[11px] font-bold text-typography-muted uppercase tracking-wider">
                <th className="py-3 px-4">Artigo & Resumo</th>
                <th className="py-3 px-4">Pilar / Categoria</th>
                <th className="py-3 px-4">SEO Score & Volume</th>
                <th className="py-3 px-4">Modelo IA Gerador</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações de Moderação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-surface-muted/30 transition-colors">
                  {/* Título e Resumo */}
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-11 rounded-lg overflow-hidden border border-surface-border bg-slate-900 shrink-0">
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-typography-heading line-clamp-1">{article.title}</p>
                        <p className="text-[11px] text-typography-muted line-clamp-1 mt-0.5">
                          {article.excerpt}
                        </p>
                        <p className="text-[10px] text-purple-700 font-mono mt-0.5">
                          🔑 {article.focusKeyword}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {getCategoryLabel(article.category)}
                    </span>
                  </td>

                  {/* SEO Score & Palavras */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-purple-900">{article.seoScore}/100</span>
                    </div>
                    <p className="text-[10px] text-typography-muted font-mono mt-0.5">
                      {article.wordCount} palavras • {article.readingTimeMinutes} min
                    </p>
                  </td>

                  {/* Modelo IA */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-medium text-typography-heading">{article.generatedByModel}</p>
                    <p className="text-[10px] text-typography-muted font-mono">{article.createdAt}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(article.status)}
                  </td>

                  {/* Ações de Moderação */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => onReviewArticle(article)}
                      >
                        Revisar
                      </Button>

                      {article.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => onQuickApprove(article)}
                            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
                            title="Aprovar em 1 clique"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onQuickReject(article)}
                            className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                            title="Rejeitar para reescrita"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
