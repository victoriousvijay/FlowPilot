# Integration Architecture

Each integration is an adapter, not scattered provider code.

## Adapter responsibilities
- Metadata
- Supported triggers/actions
- Config validation
- Credential requirements
- API calls
- Normalized result/error

## Example structure

```text
src/
  integrations/
    registry.ts
    types.ts
    webhook/
    anthropic/
    gmail/
    google-sheets/
    slack/
```

## Registry
The registry maps:
`integrationId + actionId -> adapter`

The execution engine must reject anything not present in the registry.

## Credentials
OAuth/API credentials belong to the credential subsystem. Workflow definitions contain credential references only.

## MVP approach
Implement the smallest useful action for each integration. Do not create a huge abstraction before the first few integrations work end-to-end.
