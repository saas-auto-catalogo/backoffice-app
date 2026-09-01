import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  X,
  Sparkles,
  RotateCcw,
  FileText,
  Clock,
  Send,
  Eye
} from 'lucide-react';
import { BlogArticle } from '../../types/blogModeration.js';

export interface ArticleReviewEditorModalProps {
  article: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (article: BlogArticle) => void;
  onReject: (article: BlogArticle, reason: string) => void;
  isProcessing?: boolean;
}

export function ArticleReviewEditorModal({
  article,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing = false,
}: ArticleReviewEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'meta'>('preview');
  const [rejectPrompt, setRejectPrompt] = useState(false);
  const [rejectReason, setRejectReason] = useState('Ajustar densidade de palavras-chave e incluir mais CTAs para o teste grátis.');

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-4xl overflow-hidden border-slate-300 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <CardHeader className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Revisão & Moderação de Artigo AI (Audience First SEO)
              </h3>
              <p className="text-xs text-purple-200">
                Gerado por: {article.generatedByModel} • {article.wordCount} palavras ({article.readingTimeMinutes} min de leitura)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              SEO Score: {article.seoScore}/100
            </Badge>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        {/* Abas Superiores: Prévia do Artigo vs Metadados SEO */}
        <div className="px-6 py-2 bg-surface-muted/50 border-b border-surface-border flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white text-brand-primary shadow-subtle border border-surface-border'
                : 'text-typography-muted hover:text-typography-heading'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Prévia do Artigo Formatado</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'meta'
                ? 'bg-white text-brand-primary shadow-subtle border border-surface-border'
                : 'text-typography-muted hover:text-typography-heading'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Metadados & Otimização SEO</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <CardContent className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              {/* Capa e Header do Post */}
              <div className="rounded-xl overflow-hidden border border-surface-border aspect-[21/9] max-h-56 relative bg-slate-900">
                <img
                  src={article.coverImageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute bottom-3 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg text-white border border-white/20">
                  <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                    {article.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold leading-tight mt-0.5">
                    {article.title}
                  </h2>
                </div>
              </div>

              {/* Corpo em Markdown Formatado */}
              <div className="bg-white rounded-xl border border-surface-border p-6 shadow-subtle space-y-4 text-xs text-typography-body leading-relaxed">
                <div className="prose prose-sm max-w-none space-y-3">
                  {article.contentMarkdown.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 key={index} className="text-base font-bold text-typography-heading pt-2 border-b border-surface-border pb-1">
                          {paragraph.replace('## ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={index} className="text-sm font-bold text-brand-primary pt-1">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('> ')) {
                      return (
                        <blockquote key={index} className="p-3 bg-purple-50/80 border-l-4 border-purple-600 rounded-r-lg text-purple-950 font-medium italic">
                          {paragraph.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    return <p key={index}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-typography-heading mb-1">Título H1 do Artigo</label>
                  <input
                    type="text"
                    defaultValue={article.title}
                    className="w-full px-3 py-2 bg-surface-muted/50 border border-surface-border rounded-lg text-typography-heading font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-typography-heading mb-1">Slug URL Canônica</label>
                  <input
                    type="text"
                    defaultValue={article.slug}
                    className="w-full px-3 py-2 bg-surface-muted/50 border border-surface-border rounded-lg font-mono text-typography-heading focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-typography-heading mb-1">Palavra-chave Foco (SEO)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={article.focusKeyword}
                    className="w-full px-3 py-2 bg-surface-muted/50 border border-surface-border rounded-lg font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <Badge variant="purple" size="md">
                    Volume Alto
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block font-bold text-typography-heading mb-1">Meta Description (Snippet do Google)</label>
                <textarea
                  rows={3}
                  defaultValue={article.metaDescription}
                  className="w-full px-3 py-2 bg-surface-muted/50 border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Prompt de Rejeição */}
          {rejectPrompt && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2 text-xs">
              <label className="block font-bold text-red-900">
                Motivo da Devolução / Instruções para Reescrita pela IA:
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 bg-white border border-red-300 rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-price"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setRejectPrompt(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onReject(article, rejectReason)}
                  loading={isProcessing}
                >
                  Confirmar Rejeição
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Rodapé de Ações */}
        <div className="px-6 py-3.5 bg-surface-muted/40 border-t border-surface-border flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-typography-muted">
            <Clock className="w-3.5 h-3.5 text-typography-subtle" />
            <span>Criado em: {article.createdAt}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              onClick={() => setRejectPrompt(true)}
              disabled={isProcessing || rejectPrompt}
              icon={<RotateCcw className="w-4 h-4 text-brand-price" />}
            >
              Rejeitar & Reajustar
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
              className="bg-purple-700 hover:bg-purple-800"
              onClick={() => onApprove(article)}
              loading={isProcessing}
            >
              Aprovar & Publicar no Blog
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
