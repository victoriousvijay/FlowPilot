# Database Design

Use Supabase/Postgres.

## users
Prefer Supabase Auth's users rather than duplicating authentication state.

## workflows
Fields:
- id UUID primary key
- user_id UUID
- name TEXT
- description TEXT nullable
- status TEXT
- definition JSONB
- current_version INTEGER
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

## workflow_versions
Fields:
- id UUID
- workflow_id UUID
- version INTEGER
- definition JSONB
- created_at TIMESTAMPTZ

## credentials
Fields:
- id UUID
- user_id UUID
- integration TEXT
- display_name TEXT
- encrypted_secret/reference TEXT
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Do not store plaintext credentials.

## execution_runs
Fields:
- id UUID
- workflow_id UUID
- user_id UUID
- status TEXT
- trigger_input JSONB nullable
- started_at TIMESTAMPTZ
- finished_at TIMESTAMPTZ nullable
- error TEXT nullable

## execution_steps
Fields:
- id UUID
- execution_id UUID
- step_id TEXT
- status TEXT
- input JSONB nullable
- output JSONB nullable
- error TEXT nullable
- started_at TIMESTAMPTZ
- finished_at TIMESTAMPTZ nullable

## Security
Enable Row Level Security on user-owned tables. Users must only access their own workflows, credentials, and execution history.
