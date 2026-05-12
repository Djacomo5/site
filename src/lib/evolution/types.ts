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

export interface WebhookEvent {
  key: string;
  data: {
    key: {
      id: string;
      from: string;
      to: string;
      timestamp: number;
    };
    status: 'sent' | 'delivered' | 'failed';
    message: {
      id: string;
    };
  };
}
