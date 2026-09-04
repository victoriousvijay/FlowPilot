# Testing Strategy

## MVP principle
Test the critical path, not every hypothetical case.

## Critical path
1. User submits prompt.
2. Server calls Anthropic.
3. Response validates against workflow schema.
4. Workflow renders.
5. Workflow saves.
6. Test execution runs.
7. Execution result is stored.
8. User can activate/deactivate.

## Test cases

### Generation
- valid supported request
- unsupported integration
- malformed model response
- empty prompt

### Validation
- missing trigger
- unsupported action
- invalid config
- duplicate/invalid IDs

### Persistence
- user can access own workflows
- user cannot access another user's workflow
- version is preserved

### Execution
- successful webhook
- provider error
- missing credential
- invalid input
- partial step failure

### Security
- API key never returned to browser
- service-role key never used client-side
- unauthorized workflow access rejected
