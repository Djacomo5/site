-- Profiles: extende auth.users
create table profiles (
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
create table customers (
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
create table charges (
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
create table message_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('pre_due','due_day','overdue_1','overdue_3','overdue_7')),
  content text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Message Logs
create table message_logs (
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
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan text not null,
  status text default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);
