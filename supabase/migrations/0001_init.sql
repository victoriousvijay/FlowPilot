-- Core schema for the AI automation generator MVP.
-- Uses Supabase Auth's auth.users rather than duplicating authentication state.

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused')),
  definition jsonb not null,
  current_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workflow_versions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  version integer not null,
  definition jsonb not null,
  created_at timestamptz not null default now(),
  unique (workflow_id, version)
);

create table if not exists credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  integration text not null,
  display_name text not null,
  encrypted_secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, integration)
);

create table if not exists execution_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('running', 'success', 'failed')),
  trigger_input jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error text
);

create table if not exists execution_steps (
  id uuid primary key default gen_random_uuid(),
  execution_id uuid not null references execution_runs(id) on delete cascade,
  step_id text not null,
  status text not null check (status in ('success', 'failed', 'skipped')),
  input jsonb,
  output jsonb,
  error text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists workflows_user_id_idx on workflows(user_id);
create index if not exists workflow_versions_workflow_id_idx on workflow_versions(workflow_id);
create index if not exists credentials_user_id_idx on credentials(user_id);
create index if not exists execution_runs_workflow_id_idx on execution_runs(workflow_id);
create index if not exists execution_runs_user_id_idx on execution_runs(user_id);
create index if not exists execution_steps_execution_id_idx on execution_steps(execution_id);

-- Row Level Security: users may only access their own records.

alter table workflows enable row level security;
alter table workflow_versions enable row level security;
alter table credentials enable row level security;
alter table execution_runs enable row level security;
alter table execution_steps enable row level security;

create policy "Users manage own workflows" on workflows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own workflow versions" on workflow_versions
  for select using (
    exists (select 1 from workflows w where w.id = workflow_versions.workflow_id and w.user_id = auth.uid())
  );

create policy "Users manage own credentials" on credentials
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own execution runs" on execution_runs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own execution steps" on execution_steps
  for select using (
    exists (select 1 from execution_runs r where r.id = execution_steps.execution_id and r.user_id = auth.uid())
  );

-- Server-side writes to workflow_versions and execution_steps go through the
-- service-role client (execution engine), which bypasses RLS by design.
