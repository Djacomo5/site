-- Enable RLS on all tables
alter table profiles enable row level security;
alter table customers enable row level security;
alter table charges enable row level security;
alter table message_templates enable row level security;
alter table message_logs enable row level security;
alter table subscriptions enable row level security;

-- Profiles policies
create policy "users_own_profile" on profiles
  for all using (auth.uid() = id);

-- Customers policies
create policy "users_own_customers" on customers
  for all using (auth.uid() = user_id);

-- Charges policies
create policy "users_own_charges" on charges
  for all using (auth.uid() = user_id);

-- Message Templates policies
create policy "users_own_templates" on message_templates
  for all using (auth.uid() = user_id);

-- Message Logs policies (access via charge)
create policy "users_own_message_logs" on message_logs
  for all using (
    charge_id in (
      select id from charges where user_id = auth.uid()
    )
  );

-- Subscriptions policies
create policy "users_own_subscriptions" on subscriptions
  for all using (auth.uid() = user_id);
