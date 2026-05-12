import type { Profile, Customer, Charge, MessageTemplate } from './database.types';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  cpf_cnpj?: string;
  notes?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CreateChargeRequest {
  customer_id: string;
  description?: string;
  amount: number;
  due_date: string;
}

export interface UpdateChargeRequest extends Partial<CreateChargeRequest> {
  status?: Charge['status'];
}

export interface DashboardStats {
  total_receivable: number;
  total_received_month: number;
  overdue_count: number;
  recovery_rate: number;
  recent_activity: ActivityItem[];
  overdue_charges: (Charge & { customer: Customer })[];
  monthly_revenue: MonthlyRevenue[];
}

export interface ActivityItem {
  id: string;
  type: 'charge_created' | 'charge_paid' | 'message_sent' | 'customer_created';
  description: string;
  created_at: string;
}

export interface MonthlyRevenue {
  date: string;
  amount: number;
}

export interface PlanLimits {
  starter: 100;
  pro: 500;
  business: number;
}

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

export interface EvolutionMessage {
  key: string;
  message: string;
}
