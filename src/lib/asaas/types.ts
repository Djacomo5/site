export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
}

export interface AsaasCharge {
  id: string;
  customer: string;
  value: number;
  dueDate: string;
  billingType: string;
  status: string;
  pixCode?: string;
  pixQrCode?: string;
  pixQrCodeUrl?: string;
}

export interface AsaasWebhookEvent {
  event: string;
  payment: {
    id: string;
    customer: string;
    value: number;
    dueDate: string;
    paymentDate: string;
    status: string;
  };
}
