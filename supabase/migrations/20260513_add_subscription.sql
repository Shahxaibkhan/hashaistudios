-- Add subscription fields to restaurants
-- subscription_status: 'trial' | 'active' | 'expired' | 'suspended'
-- subscription_plan:   'starter' | 'boost' | 'pro' | null
-- subscription_expires_at: timestamp when subscription ends (null = no expiry for trial)

alter table restaurants
  add column if not exists subscription_status text not null default 'trial',
  add column if not exists subscription_plan text default null,
  add column if not exists subscription_expires_at timestamptz default null;
