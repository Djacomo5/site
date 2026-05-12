export type Plan = 'starter' | 'pro' | 'business';

export type ChargeStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export type TemplateType = 'pre_due' | 'due_day' | 'overdue_1' | 'overdue_3' | 'overdue_7';

export type MessageStatus = 'scheduled' | 'sent' | 'delivered' | 'failed';

export interface Profile {
  id: string;
  name: string;
  company_name: string | null;
  phone: string | null;
  asaas_api_key: string | null;
  evolution_api_url: string | null;
  evolution_api_key: string | null;
  evolution_instance: string | null;
  plan: Plan;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string | null;
  cpf_cnpj: string | null;
  notes: string | null;
  asaas_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Charge {
  id: string;
  user_id: string;
  customer_id: string;
  description: string | null;
  amount: number;
  due_date: string;
  status: ChargeStatus;
  asaas_charge_id: string | null;
  pix_payload: string | null;
  pix_qr_code_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  user_id: string;
  type: TemplateType;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface MessageLog {
  id: string;
  charge_id: string;
  template_type: TemplateType | null;
  scheduled_for: string | null;
  sent_at: string | null;
  status: MessageStatus;
  provider_message_id: string | null;
  error_message: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  status: string;
  current_period_end: string;
  created_at: string;
}
