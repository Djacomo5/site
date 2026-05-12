import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: ptBR });
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatPhoneInternational(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 11) {
    return `+55${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+55${cleaned}`;
  }
  return `+55${cleaned}`;
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export const PLAN_LIMITS = {
  starter: 100,
  pro: 500,
  business: Infinity,
} as const;

export const PLAN_NAMES = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
} as const;

export const PLAN_PRICES = {
  starter: 49,
  pro: 97,
  business: 197,
} as const;

export function replaceTemplateVariables(
  template: string,
  variables: {
    nome: string;
    valor: string;
    vencimento: string;
    pix?: string;
  }
): string {
  return template
    .replace(/\{\{nome\}\}/g, variables.nome)
    .replace(/\{\{valor\}\}/g, variables.valor)
    .replace(/\{\{vencimento\}\}/g, variables.vencimento)
    .replace(/\{\{pix\}\}/g, variables.pix || '');
}

export function calculateDaysOverdue(dueDate: string): number {
  const due = parseISO(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
