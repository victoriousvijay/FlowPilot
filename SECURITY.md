# Security Requirements

## Secrets
Never expose:
- ANTHROPIC_API_KEY
- Supabase service role key
- OAuth client secrets
- provider access/refresh tokens

Never put secrets in client bundles, workflow definitions, logs, screenshots, or error messages.

## AI safety
AI-generated workflow data is untrusted input.
Validate it before:
- persistence
- rendering
- execution

Never execute arbitrary code produced by the model.

## Database
Use Supabase RLS for user-owned records.

## Webhooks
- Use signed/secret webhook URLs where appropriate.
- Validate payload size.
- Rate limit public endpoints.
- Do not log sensitive payloads by default.

## Integrations
Use least-privilege OAuth scopes whenever possible.

## Logging
Log:
- execution IDs
- workflow IDs
- step IDs
- safe status/error information

Do not log:
- access tokens
- API keys
- full email bodies unless explicitly required
- credential contents

## Production
Use HTTPS, secure cookies, environment variables, and platform secret storage.
