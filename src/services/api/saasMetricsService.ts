import { httpClient } from './httpClient.js';
import { SaaSFinancialMetrics } from '../../types/saasMetrics.js';

const MOCK_FINANCIALS: SaaSFinancialMetrics = {
  currentMrr: 84500,
  mrrGrowthMoM: 12.4,
  arrProjected: 1014000,
  churnRateMonthly: 0.8,
  ltvBrl: 14800,
  cacBrl: 1250,
  ltvCacRatio: 11.8,
  paybackMonths: 1.1,
  netNewTenantsThisMonth: 14,
  totalActiveTenants: 128,
  totalVehiclesManaged: 18420,
  feedRequestsMonthly: 4820000,
  feedCacheHitRate: 99.98,
  monthlyHistory: [
    { month: 'Mar/26', mrr: 48200, newMrr: 6800, expansionMrr: 1200, churnedMrr: 400, netNewMrr: 7600, tenantsCount: 74 },
    { month: 'Abr/26', mrr: 55400, newMrr: 7800, expansionMrr: 900, churnedMrr: 500, netNewMrr: 7200, tenantsCount: 85 },
    { month: 'Mai/26', mrr: 62800, newMrr: 8200, expansionMrr: 1400, churnedMrr: 600, netNewMrr: 7400, tenantsCount: 96 },
    { month: 'Jun/26', mrr: 69900, newMrr: 8900, expansionMrr: 1100, churnedMrr: 700, netNewMrr: 7100, tenantsCount: 106 },
    { month: 'Jul/26', mrr: 75200, newMrr: 6800, expansionMrr: 1500, churnedMrr: 600, netNewMrr: 5300, tenantsCount: 114 },
    { month: 'Ago/26', mrr: 84500, newMrr: 10200, expansionMrr: 1800, churnedMrr: 700, netNewMrr: 9300, tenantsCount: 128 },
  ],
  plansDistribution: [
    { planName: 'Enterprise DAA (Full)', planKey: 'ENTERPRISE', tenantsCount: 30, mrrTotal: 44700, percentageOfRevenue: 52.9, pricePerTenant: 1490 },
    { planName: 'Pro Automotive', planKey: 'PRO', tenantsCount: 30, mrrTotal: 26700, percentageOfRevenue: 31.6, pricePerTenant: 890 },
    { planName: 'Scale Multi-Lojas', planKey: 'SCALE', tenantsCount: 4, mrrTotal: 9160, percentageOfRevenue: 10.8, pricePerTenant: 2290 },
    { planName: 'Starter Catalog', planKey: 'STARTER', tenantsCount: 8, mrrTotal: 3940, percentageOfRevenue: 4.7, pricePerTenant: 490 },
  ],
  dmsDistribution: [
    { dmsName: 'AutoCerto XML', tenantsCount: 48, vehiclesCount: 7100, sharePercentage: 38.5 },
    { dmsName: 'Altimus Hub', tenantsCount: 41, vehiclesCount: 6200, sharePercentage: 33.6 },
    { dmsName: 'Sisvag DMS', tenantsCount: 19, vehiclesCount: 2650, sharePercentage: 14.4 },
    { dmsName: 'BomControle ERP', tenantsCount: 12, vehiclesCount: 1450, sharePercentage: 7.9 },
    { dmsName: 'Webmotors / Custom', tenantsCount: 8, vehiclesCount: 1020, sharePercentage: 5.6 },
  ],
};

export const saasMetricsService = {
  async getFinancialMetrics(): Promise<SaaSFinancialMetrics> {
    try {
      const res = await httpClient.get<SaaSFinancialMetrics>('/admin/metrics/financials', { timeout: 4000 });
      return res;
    } catch {
      return MOCK_FINANCIALS;
    }
  },
};
