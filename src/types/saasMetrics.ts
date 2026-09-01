export interface MonthlyRevenueData {
  month: string;
  mrr: number;
  newMrr: number;
  expansionMrr: number;
  churnedMrr: number;
  netNewMrr: number;
  tenantsCount: number;
}

export interface PlanDistribution {
  planName: string;
  planKey: string;
  tenantsCount: number;
  mrrTotal: number;
  percentageOfRevenue: number;
  pricePerTenant: number;
}

export interface DmsMarketShare {
  dmsName: string;
  tenantsCount: number;
  vehiclesCount: number;
  sharePercentage: number;
}

export interface SaaSFinancialMetrics {
  currentMrr: number;
  mrrGrowthMoM: number;
  arrProjected: number;
  churnRateMonthly: number;
  ltvBrl: number;
  cacBrl: number;
  ltvCacRatio: number;
  paybackMonths: number;
  netNewTenantsThisMonth: number;
  totalActiveTenants: number;
  totalVehiclesManaged: number;
  feedRequestsMonthly: number;
  feedCacheHitRate: number;
  monthlyHistory: MonthlyRevenueData[];
  plansDistribution: PlanDistribution[];
  dmsDistribution: DmsMarketShare[];
}
