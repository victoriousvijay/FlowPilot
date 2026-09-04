# Implementation Instructions

## Code quality
- TypeScript strictness should remain enabled.
- Prefer small focused modules.
- Use server components/server actions where appropriate.
- Keep client components limited to interactive UI.
- Validate external input.
- Avoid `any` unless unavoidable and documented.
- Use descriptive names.

## AI implementation
Use Anthropic only from the server.

The generation prompt should:
- explain the supported integrations/actions
- require the exact workflow schema
- forbid unsupported actions
- avoid inventing credentials
- return only structured workflow data through the chosen structured-output mechanism
- produce a concise user-facing explanation separately if needed

Never let model output become raw SQL, shell commands, or arbitrary server code.

## Error handling
Handle:
- invalid AI output
- unsupported integration
- missing credentials
- provider API errors
- rate limits
- timeouts
- malformed user input

Show actionable errors to users.

## UI
Use shadcn/ui components where useful.
Keep the visual system premium, modern, minimal, and product-focused.
The primary action should always be obvious.

## Performance
- Avoid unnecessary API calls.
- Do not regenerate workflows when a small edit can be applied.
- Cache stable integration metadata where useful.
- Avoid repeated reads of the same files/data.
