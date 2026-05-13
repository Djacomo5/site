-- ============================================
-- CobraZap Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- MIGRATION 001: Initial Schema
-- ============================================

-- Profiles: extende auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  company_name text,
  phone text,
  asaas_api_key text,
  evolution_api_url text,
  evolution_api_key text,
  evolution_instance text,
  plan text default 'starter' check (plan in ('starter','pro','business')),
  onboarding_completed boolean default false,
  onboarding_step integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  cpf_cnpj text,
  notes text,
  asaas_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Charges
create table if not exists charges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  description text,
  amount numeric(10,2) not null check (amount > 0),
  due_date date not null,
  status text default 'pending' check (status in ('pending','paid','overdue','cancelled')),
  asaas_charge_id text unique,
  pix_payload text,
  pix_qr_code_url text,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Message Templates
create table if not exists message_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('pre_due','due_day','overdue_1','overdue_3','overdue_7')),
  content text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Message Logs
create table if not exists message_logs (
  id uuid primary key default gen_random_uuid(),
  charge_id uuid not null references charges(id) on delete cascade,
  template_type text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  status text default 'scheduled' check (status in ('scheduled','sent','delivered','failed')),
  provider_message_id text,
  error_message text,
  created_at timestamptz default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan text not null,
  status text default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- MIGRATION 002: RLS Policies
-- ============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table customers enable row level security;
alter table charges enable row level security;
alter table message_templates enable row level security;
alter table message_logs enable row level security;
alter table subscriptions enable row level security;

-- Profiles policies
drop policy if exists "users_own_profile" on profiles;
create policy "users_own_profile" on profiles
  for all using (auth.uid() = id);

-- Customers policies
drop policy if exists "users_own_customers" on customers;
create policy "users_own_customers" on customers
  for all using (auth.uid() = user_id);

-- Charges policies
drop policy if exists "users_own_charges" on charges;
create policy "users_own_charges" on charges
  for all using (auth.uid() = user_id);

-- Message Templates policies
drop policy if exists "users_own_templates" on message_templates;
create policy "users_own_templates" on message_templates
  for all using (auth.uid() = user_id);

-- Message Logs policies (access via charge)
drop policy if exists "users_own_message_logs" on message_logs;
create policy "users_own_message_logs" on message_logs
  using (
    charge_id in (
      select id from charges where user_id = auth.uid()
    )
  );

-- Subscriptions policies
drop policy if exists "users_own_subscriptions" on subscriptions;
create policy "users_own_subscriptions" on subscriptions
  for all using (auth.uid() = user_id);

-- ============================================
-- MIGRATION 003: Triggers
-- ============================================

-- Function to auto-update updated_at
drop function if exists update_updated_at();
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

drop trigger if exists set_customers_updated_at on customers;
create trigger set_customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

drop trigger if exists set_charges_updated_at on charges;
create trigger set_charges_updated_at
  before update on charges
  for each row execute function update_updated_at();

-- Function to create profile on user registration
-- IMPORTANTE: primeiro remover o trigger, depois a função
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Function to insert default templates for new users
-- IMPORTANTE: primeiro remover o trigger, depois a função
drop trigger if exists on_profile_created on profiles;
drop function if exists insert_default_templates();
create or replace function insert_default_templates()
returns trigger as $$
begin
  insert into message_templates (user_id, type, content) values
    (new.id, 'pre_due', 'Olá {{nome}}, lembramos que sua cobrança de R$ {{valor}} vence no dia {{vencimento}}. Para evitar atrasos, realize o pagamento via PIX:\n\n{{pix}}'),
    (new.id, 'due_day', 'Olá {{nome}}, hoje é o dia do vencimento da sua cobrança de R$ {{valor}}. Utilize o PIX abaixo para realizar o pagamento:\n\n{{pix}}'),
    (new.id, 'overdue_1', 'Olá {{nome}}, sua cobrança de R$ {{valor}} está em atraso desde {{vencimento}}. Por favor, regularize o quanto antes:\n\n{{pix}}'),
    (new.id, 'overdue_3', 'Olá {{nome}}, sua cobrança de R$ {{valor}} está há 3 dias em atraso. Precisamos da sua atenção:\n\n{{pix}}'),
    (new.id, 'overdue_7', 'Olá {{nome}}, sua cobrança de R$ {{valor}} está há 7 dias em atraso. Por favor, entre em contato para regularizar a situação.\n\n{{pix}}');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on profiles
  for each row execute function insert_default_templates();

-- ============================================
-- Done!
-- ============================================