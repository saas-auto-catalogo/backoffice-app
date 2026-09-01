import { env } from '../../config/env.js';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  adminToken?: string;
}

export class BackofficeHttpClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = env.apiUrl, defaultTimeout: number = env.apiTimeout) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultTimeout = defaultTimeout;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      params,
      timeout = this.defaultTimeout,
      adminToken = 'superadmin-master-jwt-token',
      headers: customHeaders,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint, params);

    const headers = new Headers(customHeaders);
    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');
    headers.set('Authorization', `Bearer ${adminToken}`);
    headers.set('x-role', 'SUPER_ADMIN');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 204) {
        return {} as T;
      }

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const responseData = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(responseData?.message || `Erro HTTP ${response.status}`);
      }

      return responseData as T;
    } catch (error: any) {
      clearTimeout(timer);
      throw error;
    }
  }

  public get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new BackofficeHttpClient();
