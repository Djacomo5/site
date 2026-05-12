import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cpf_cnpj: z.string().optional(),
  notes: z.string().optional(),
});

export const chargeSchema = z.object({
  customer_id: z.string().uuid('Cliente inválido'),
  description: z.string().optional(),
  amount: z.number().positive('Valor deve ser maior que zero'),
  due_date: z.string().min(1, 'Data de vencimento é obrigatória'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  company_name: z.string().optional(),
  phone: z.string().optional(),
});

export const integrationSchema = z.object({
  asaas_api_key: z.string().optional(),
  evolution_api_url: z.string().url('URL inválida').optional().or(z.literal('')),
  evolution_api_key: z.string().optional(),
  evolution_instance: z.string().optional(),
});

export const templateSchema = z.object({
  type: z.enum(['pre_due', 'due_day', 'overdue_1', 'overdue_3', 'overdue_7']),
  content: z.string().min(10, 'Template deve ter pelo menos 10 caracteres'),
  is_active: z.boolean().default(true),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type ChargeFormData = z.infer<typeof chargeSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type IntegrationFormData = z.infer<typeof integrationSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;
