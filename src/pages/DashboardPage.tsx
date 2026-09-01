import { useState, useEffect } from 'react';
import { SuperAdminSidebar } from '../components/layout/SuperAdminSidebar.js';
import { SuperAdminHeader } from '../components/layout/SuperAdminHeader.js';
import { MetricCard } from '../components/ui/MetricCard.js';
import { TenantsTable } from '../components/tenants/TenantsTable.js';
import { ImpersonateModal } from '../components/tenants/ImpersonateModal.js';
import { ImpersonateBanner } from '../components/tenants/ImpersonateBanner.js';
import { AuditLogsTable } from '../components/audit/AuditLogsTable.js';
import { FeedHealthOverview } from '../components/feeds/FeedHealthOverview.js';
import { FeedMonitoringTable } from '../components/feeds/FeedMonitoringTable.js';
import { FeedDiagnosticModal } from '../components/feeds/FeedDiagnosticModal.js';
import { BlogModerationQueue } from '../components/blog-moderation/BlogModerationQueue.js';
import { ArticleReviewEditorModal } from '../components/blog-moderation/ArticleReviewEditorModal.js';
import { SaaSFinancialsDashboard } from '../components/financials/SaaSFinancialsDashboard.js';
import { Card, CardHeader, CardContent } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import {
  DollarSign,
  Building2,
  Car,
  Activity,
  GitBranch,
  Sparkles,
  RotateCw,
  FileCheck2,
  Check,
  X
} from 'lucide-react';
import { tenantService } from '../services/api/tenantService.js';
import { auditLogService } from '../services/api/auditLogService.js';
import { feedMonitoringService } from '../services/api/feedMonitoringService.js';
import { blogModerationService } from '../services/api/blogModerationService.js';
import { saasMetricsService } from '../services/api/saasMetricsService.js';
import { Tenant, SaaSOverviewMetrics, AuditLog } from '../types/backoffice.js';
import { MonitoredFeed, FeedsTelemetryMetrics } from '../types/feedMonitoring.js';
import { BlogArticle, BlogModerationMetrics } from '../types/blogModeration.js';
import { SaaSFinancialMetrics } from '../types/saasMetrics.js';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('tenants');
  const [metrics, setMetrics] = useState<SaaSOverviewMetrics | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [feeds, setFeeds] = useState<MonitoredFeed[]>([]);
  const [feedsTelemetry, setFeedsTelemetry] = useState<FeedsTelemetryMetrics | null>(null);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [blogMetrics, setBlogMetrics] = useState<BlogModerationMetrics | null>(null);
  const [financials, setFinancials] = useState<SaaSFinancialMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [impersonateModalTenant, setImpersonateModalTenant] = useState<Tenant | null>(null);
  const [activeImpersonation, setActiveImpersonation] = useState<Tenant | null>(null);
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);

  const [selectedDiagnosticFeed, setSelectedDiagnosticFeed] = useState<MonitoredFeed | null>(null);
  const [isSyncingFeed, setIsSyncingFeed] = useState<boolean>(false);
  const [isSyncingBatch, setIsSyncingBatch] = useState<boolean>(false);

  const [selectedReviewArticle, setSelectedReviewArticle] = useState<BlogArticle | null>(null);
  const [isProcessingArticle, setIsProcessingArticle] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, t, l, f, ft, a, bm, fin] = await Promise.all([
        tenantService.getOverviewMetrics(),
        tenantService.listTenants(),
        auditLogService.listLogs(),
        feedMonitoringService.listFeeds(),
        feedMonitoringService.getTelemetryMetrics(),
        blogModerationService.listArticles(),
        blogModerationService.getMetrics(),
        saasMetricsService.getFinancialMetrics(),
      ]);
      setMetrics(m);
      setTenants(t);
      setAuditLogs(l);
      setFeeds(f);
      setFeedsTelemetry(ft);
      setArticles(a);
      setBlogMetrics(bm);
      setFinancials(fin);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartImpersonate = async (tenant: Tenant, reason: string) => {
    try {
      setIsImpersonating(true);
      await tenantService.impersonateTenant(tenant.id, reason);
      setActiveImpersonation(tenant);
      setImpersonateModalTenant(null);

      const updatedLogs = await auditLogService.listLogs();
      setAuditLogs(updatedLogs);

      alert(`🔑 Sessão de Impersonation iniciada com sucesso na conta '${tenant.tradeName}'! Ação registrada na auditoria.`);
    } finally {
      setIsImpersonating(false);
    }
  };

  const handleExitImpersonate = async () => {
    if (!activeImpersonation) return;
    await tenantService.endImpersonation(activeImpersonation.id);
    setActiveImpersonation(null);

    const updatedLogs = await auditLogService.listLogs();
    setAuditLogs(updatedLogs);

    alert('🔒 Sessão de Impersonation encerrada com sucesso.');
  };

  const handleForceGlobalSync = async () => {
    try {
      setIsSyncingAll(true);
      const res = await tenantService.forceGlobalSync();
      await loadData();
      alert(`🔄 ${res.message}`);
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleReSyncSingleFeed = async (feed: MonitoredFeed) => {
    try {
      setIsSyncingFeed(true);
      const res = await feedMonitoringService.triggerFeedSync(feed.id);
      await loadData();
      alert(`🔄 ${res.message} (Latência: ${res.durationMs}ms)`);
      if (selectedDiagnosticFeed?.id === feed.id) {
        setSelectedDiagnosticFeed(null);
      }
    } finally {
      setIsSyncingFeed(false);
    }
  };

  const handleReSyncBatchFeeds = async (feedIds: string[]) => {
    try {
      setIsSyncingBatch(true);
      const res = await feedMonitoringService.triggerBatchSync(feedIds);
      await loadData();
      alert(`🔄 ${res.message}`);
    } finally {
      setIsSyncingBatch(false);
    }
  };

  const handleApproveArticle = async (article: BlogArticle) => {
    try {
      setIsProcessingArticle(true);
      const res = await blogModerationService.approveAndPublish(article.id);
      await loadData();
      setSelectedReviewArticle(null);
      alert(`🎉 ${res.message}`);
    } finally {
      setIsProcessingArticle(false);
    }
  };

  const handleRejectArticle = async (article: BlogArticle, reason: string) => {
    try {
      setIsProcessingArticle(true);
      const res = await blogModerationService.rejectArticle(article.id, reason);
      await loadData();
      setSelectedReviewArticle(null);
      alert(`⚠️ ${res.message}`);
    } finally {
      setIsProcessingArticle(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas text-typography-body">
      {activeImpersonation && (
        <ImpersonateBanner
          tenant={activeImpersonation}
          onExit={handleExitImpersonate}
        />
      )}

      <div className="flex-1 flex min-h-screen">
        <SuperAdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <SuperAdminHeader
            onForceSyncAll={handleForceGlobalSync}
            isSyncingAll={isSyncingAll}
          />

          <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="MRR Total Contratado"
                value={
                  metrics?.mrrTotal
                    ? metrics.mrrTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'R$ 84.500'
                }
                change="+12.4% MoM"
                changeType="positive"
                subtitle="Faturamento recorrente mensal"
                icon={<DollarSign className="w-5 h-5 text-brand-price" />}
                highlightPrice
              />

              <MetricCard
                title="Concessionárias Ativas"
                value={metrics?.activeTenantsCount ?? 128}
                change="98.4% uptime"
                changeType="positive"
                subtitle="Tenants com feeds sincronizados"
                icon={<Building2 className="w-5 h-5 text-brand-primary" />}
              />

              <MetricCard
                title="Veículos Indexados"
                value={
                  metrics?.totalVehiclesIndexed
                    ? metrics.totalVehiclesIndexed.toLocaleString('pt-BR')
                    : '18.420'
                }
                change="+340 hoje"
                changeType="positive"
                subtitle="Catálogo ativo Meta Automotive DAA"
                icon={<Car className="w-5 h-5 text-brand-accent" />}
              />

              <MetricCard
                title="Taxa de Sucesso Ingestão"
                value={`${metrics?.xmlSuccessRate ?? 99.92}%`}
                change="142ms méd."
                changeType="positive"
                subtitle="8 Workers Redis / BullMQ ativos"
                icon={<Activity className="w-5 h-5 text-brand-primary" />}
              />
            </div>

            {activeTab === 'tenants' && (
              <div className="space-y-6">
                <TenantsTable
                  tenants={tenants}
                  onImpersonate={(tenant) => setImpersonateModalTenant(tenant)}
                  onRefresh={loadData}
                  loading={loading}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6">
                    <Card>
                      <CardHeader className="flex items-center justify-between py-4 bg-surface-muted/30">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-brand-primary" />
                          <h3 className="text-sm font-bold text-typography-heading">
                            Telemetria de Ingestão DMS (Tempo Real)
                          </h3>
                        </div>
                        <Badge variant="available" size="sm" dot>
                          Zero Latência
                        </Badge>
                      </CardHeader>

                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/50 border border-surface-border">
                            <div>
                              <p className="font-bold text-typography-heading">AutoCerto XML Batch #4910</p>
                              <p className="text-[11px] text-typography-muted">142 veículos processados • 186ms</p>
                            </div>
                            <Badge variant="available" size="sm">Sucesso 100%</Badge>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/50 border border-surface-border">
                            <div>
                              <p className="font-bold text-typography-heading">Altimus Hub Batch #4909</p>
                              <p className="text-[11px] text-typography-muted">380 veículos processados • 240ms</p>
                            </div>
                            <Badge variant="available" size="sm">Sucesso 100%</Badge>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/50 border border-surface-border">
                            <div>
                              <p className="font-bold text-typography-heading">Sisvag DMS Stream #4908</p>
                              <p className="text-[11px] text-typography-muted">89 veículos processados • 112ms</p>
                            </div>
                            <Badge variant="amber" size="sm">4 Alertas</Badge>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<RotateCw className="w-3.5 h-3.5" />}
                            onClick={() => setActiveTab('pipelines')}
                          >
                            Abrir Monitor de Feeds
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-6">
                    <Card>
                      <CardHeader className="flex items-center justify-between py-4 bg-surface-muted/30">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-purple-600" />
                          <h3 className="text-sm font-bold text-typography-heading">
                            Fila de Moderação AI Blog ({blogMetrics?.pendingCount ?? 3} Pendentes)
                          </h3>
                        </div>
                        <Badge variant="purple" size="sm">
                          Audience First
                        </Badge>
                      </CardHeader>

                      <CardContent className="p-4 space-y-2.5">
                        {articles.filter((a) => a.status === 'PENDING_APPROVAL').slice(0, 2).map((art) => (
                          <div
                            key={art.id}
                            className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-typography-heading truncate">{art.title}</p>
                              <p className="text-[11px] text-typography-muted">
                                SEO Score: {art.seoScore}/100 • {art.wordCount} palavras
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleApproveArticle(art)}
                                className="p-1.5 rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                title="Aprovar Artigo"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRejectArticle(art, 'Rejeitado pelo SuperAdmin na fila rápida.')}
                                className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                title="Rejeitar Artigo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                            onClick={() => setActiveTab('ai-moderation')}
                          >
                            Abrir Central de Moderação
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pipelines' && (
              <div className="space-y-6">
                {feedsTelemetry && <FeedHealthOverview metrics={feedsTelemetry} />}

                <FeedMonitoringTable
                  feeds={feeds}
                  onOpenDiagnostic={(feed) => setSelectedDiagnosticFeed(feed)}
                  onReSyncSingle={handleReSyncSingleFeed}
                  onReSyncBatch={handleReSyncBatchFeeds}
                  onRefresh={loadData}
                  loading={loading}
                  isSyncingBatch={isSyncingBatch}
                />
              </div>
            )}

            {activeTab === 'ai-moderation' && (
              <div className="space-y-6">
                <BlogModerationQueue
                  articles={articles}
                  onReviewArticle={(art) => setSelectedReviewArticle(art)}
                  onQuickApprove={handleApproveArticle}
                  onQuickReject={(art) => handleRejectArticle(art, 'Rejeitado para reprocessamento.')}
                  onRefresh={loadData}
                  loading={loading}
                />
              </div>
            )}

            {activeTab === 'financials' && financials && (
              <SaaSFinancialsDashboard data={financials} />
            )}

            {activeTab === 'audit-logs' && (
              <AuditLogsTable
                logs={auditLogs}
                onRefresh={loadData}
                loading={loading}
              />
            )}
          </main>
        </div>
      </div>

      <ImpersonateModal
        tenant={impersonateModalTenant}
        isOpen={!!impersonateModalTenant}
        onClose={() => setImpersonateModalTenant(null)}
        onConfirm={handleStartImpersonate}
        isLoading={isImpersonating}
      />

      <FeedDiagnosticModal
        feed={selectedDiagnosticFeed}
        isOpen={!!selectedDiagnosticFeed}
        onClose={() => setSelectedDiagnosticFeed(null)}
        onReSync={handleReSyncSingleFeed}
        isSyncing={isSyncingFeed}
      />

      <ArticleReviewEditorModal
        article={selectedReviewArticle}
        isOpen={!!selectedReviewArticle}
        onClose={() => setSelectedReviewArticle(null)}
        onApprove={handleApproveArticle}
        onReject={handleRejectArticle}
        isProcessing={isProcessingArticle}
      />
    </div>
  );
}
