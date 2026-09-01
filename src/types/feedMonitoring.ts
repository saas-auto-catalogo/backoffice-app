export type FeedHealthStatus =
  | 'HEALTHY'
  | 'PARSING_ERROR'
  | 'STALE_OVER_24H'
  | 'TOKEN_EXPIRED'
  | 'SCHEMA_INVALID';

export interface FeedIssueDetail {
  code: string;
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  affectedCount: number;
  sampleNodeXml?: string;
}

export interface MonitoredFeed {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantTradeName: string;
  dmsProvider: string;
  xmlSourceUrl: string;
  status: FeedHealthStatus;
  healthScore: number;
  vehiclesTotal: number;
  vehiclesValid: number;
  vehiclesInvalid: number;
  lastSyncAt: string;
  lastSyncDurationMs: number;
  lastHttpCode: number;
  tokenExpiresAt: string;
  issues: FeedIssueDetail[];
}

export interface FeedsTelemetryMetrics {
  totalFeeds: number;
  healthyFeedsCount: number;
  parsingErrorsCount: number;
  staleFeedsCount: number;
  tokenExpiredCount: number;
  avgIngestionLatencyMs: number;
  totalVehiclesMonitored: number;
}
