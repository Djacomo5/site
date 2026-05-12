-- Function to auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger set_customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

create trigger set_charges_updated_at
  before update on charges
  for each row execute function update_updated_at();

-- Function to create profile on user registration
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
create or replace function insert_default_templates()
returns trigger as $$
begin
  insert into message_templates (user_id, type, content) values
    (new.id, 'pre_due', 'Olá {{nome}}, lembramos que sua cobrança de R$ {{valor}} vence no dia {{vencimento}}. Para evitar atrasos, realice o pagamento via PIX:\n\n{{pix}}'),
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
