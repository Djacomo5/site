export interface EvolutionClientOptions {
  apiUrl: string;
  apiKey: string;
}

export interface ConnectionStatus {
  instance: string;
  status: 'open' | 'close' | 'connecting';
}

export interface QrCodeResponse {
  code: string;
  base64?: string;
}

export interface SendMessageResponse {
  key: {
    id: string;
    from: string;
    to: string;
    timestamp: number;
  };
  message: string;
}

export class EvolutionClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(options: EvolutionClientOptions) {
    this.apiUrl = options.apiUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.apiKey,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na Evolution API');
    }

    return data as T;
  }

  async checkConnection(instance: string): Promise<ConnectionStatus> {
    return this.request<ConnectionStatus>(`/instance/connectionState/${instance}`);
  }

  async getQRCode(instance: string): Promise<QrCodeResponse> {
    return this.request<QrCodeResponse>(`/instance/qrCode/${instance}`);
  }

  async sendTextMessage(
    instance: string,
    phone: string,
    message: string
  ): Promise<SendMessageResponse> {
    const formattedPhone = this.formatPhone(phone);
    return this.request<SendMessageResponse>('/messages/sendText', {
      method: 'POST',
      body: JSON.stringify({
        number: formattedPhone,
        text: message,
      }),
    });
  }

  private formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55')) {
      return cleaned;
    }
    if (cleaned.length === 11) {
      return `55${cleaned}`;
    }
    if (cleaned.length === 10) {
      return `55${cleaned}`;
    }
    return `55${cleaned}`;
  }
}

export function createEvolutionClient(apiUrl: string, apiKey: string): EvolutionClient {
  return new EvolutionClient({ apiUrl, apiKey });
}
