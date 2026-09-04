# Workflow Schema

The workflow is the canonical representation shared by generation, editor, persistence, and execution.

Conceptual shape:

```ts
type Workflow = {
  id?: string;
  version: number;
  name: string;
  description?: string;
  trigger: Trigger;
  steps: Step[];
  status: "draft" | "active" | "paused";
};

type Trigger = {
  id: string;
  integration: string;
  event: string;
  config: Record<string, unknown>;
};

type Step = {
  id: string;
  integration: string;
  action: string;
  config: Record<string, unknown>;
  inputMapping?: Record<string, unknown>;
  continueOnError?: boolean;
};
```

## Supported MVP integrations/actions

### webhook
- receive

### anthropic
- generate_text
- summarize
- classify

### google_sheets
- create_row
- update_row

### slack
- send_message

### gmail
- new_email
- send_email

The exact implementation may refine these names, but the domain must remain explicit and validated.

## Rules
- Every workflow has exactly one primary trigger in MVP.
- Steps execute in order.
- Only registered integration/action pairs may execute.
- Config is validated before execution.
- Credential IDs reference stored credentials; secrets never live inside workflow JSON.
