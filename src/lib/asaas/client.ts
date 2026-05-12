import type { AsaasCustomer, AsaasCharge } from '@/types/api.types';

export interface AsaasError {
  code: string;
  description: string;
}

export interface AsaasClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class AsaasClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: AsaasClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'access_token': this.apiKey,
            ...options.headers,
          },
        });

        if (response.status === 429 || response.status === 503) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        const data = await response.json();

        if (!response.ok) {
          throw {
            code: data.code || 'UNKNOWN_ERROR',
            description: data.description || data.message || 'Erro desconhecido',
          } as AsaasError;
        }

        return data as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt === maxRetries - 1) break;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw lastError;
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone: string;
    cpfCnpj?: string;
  }): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCustomer(customerId: string): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>(`/customers/${customerId}`);
  }

  async createCharge(data: {
    customer: string;
    billingType: string;
    value: number;
    dueDate: string;
    description?: string;
    externalReference?: string;
  }): Promise<AsaasCharge> {
    return this.request<AsaasCharge>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        billingType: 'PIX',
      }),
    });
  }

  async getCharge(chargeId: string): Promise<AsaasCharge> {
    return this.request<AsaasCharge>(`/payments/${chargeId}`);
  }

  async deleteCharge(chargeId: string): Promise<{ id: string; status: string }> {
    return this.request<{ id: string; status: string }>(`/payments/${chargeId}`, {
      method: 'DELETE',
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request<{ object: string }>('/customers?limit=1');
      return true;
    } catch {
      return false;
    }
  }
}

export function createAsaasClient(apiKey: string): AsaasClient {
  return new AsaasClient({ apiKey });
}
