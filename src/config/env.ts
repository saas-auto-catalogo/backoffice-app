export interface BackofficeConfig {
  apiUrl: string;
  apiTimeout: number;
  tenantAppUrl: string;
  enableMockFallback: boolean;
  isDev: boolean;
  isProd: boolean;
}

export const env: BackofficeConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  tenantAppUrl: import.meta.env.VITE_TENANT_APP_URL || 'http://localhost:5173',
  enableMockFallback: import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
