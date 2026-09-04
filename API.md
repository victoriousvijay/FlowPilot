# API Contract

Keep the API small.

## POST /api/workflows/generate
Input:
```json
{
  "prompt": "When I receive a lead..."
}
```

Returns:
```json
{
  "workflow": {},
  "warnings": []
}
```

## POST /api/workflows
Create/save workflow.

## GET /api/workflows
List current user's workflows.

## GET /api/workflows/:id
Get workflow.

## PATCH /api/workflows/:id
Update workflow.

## DELETE /api/workflows/:id
Delete workflow.

## POST /api/workflows/:id/test
Execute in test mode.

## POST /api/workflows/:id/activate
Activate workflow.

## POST /api/workflows/:id/deactivate
Deactivate workflow.

## POST /api/webhooks/:workflowId
Receive trigger data for workflows using webhook triggers.

## API rules
- Authenticate user-owned operations.
- Validate input with Zod.
- Never return secrets.
- Use appropriate HTTP status codes.
- Keep provider errors internal and return safe actionable messages.
