# Architecture

## High-level

```text
Browser
  │
  ▼
Next.js App
  │
  ├── UI / React Flow
  │
  ├── API routes / server actions
  │       │
  │       ├── Workflow generation
  │       │       └── Anthropic API
  │       │
  │       ├── Validation
  │       │       └── Zod
  │       │
  │       ├── Workflow CRUD
  │       │       └── Supabase
  │       │
  │       └── Execution
  │               └── Integration adapters
  │
  ▼
Supabase/Postgres
```

## Layers

### Presentation
Next.js, TypeScript, Tailwind, shadcn/ui, React Flow.

### Application
Use cases:
- generateWorkflow
- validateWorkflow
- updateWorkflow
- saveWorkflow
- testWorkflow
- activateWorkflow
- executeWorkflow

### Domain
Pure types/schemas:
- Workflow
- Trigger
- Step
- Condition
- Integration
- Credential reference
- Execution

### Infrastructure
- Anthropic client
- Supabase client
- integration adapters
- webhook handling
- logging

## Key architectural rule
The AI output is never directly executed.

```text
Prompt
 ↓
Anthropic
 ↓
Structured output
 ↓
Zod validation
 ↓
Domain validation
 ↓
Workflow editor
 ↓
Execution engine
```

## Workflow representation
Store a versioned JSON workflow document. The document should be deterministic enough to render and execute.

## Integration abstraction

Each integration should expose a consistent adapter interface conceptually:

```ts
type IntegrationAdapter = {
  id: string;
  actions: ActionDefinition[];
  validateConfig(): Promise<void>;
  execute(): Promise<ActionResult>;
};
```

Keep provider-specific API logic inside its adapter.

## Scaling path
MVP can execute workflows synchronously or with a lightweight job mechanism. Move to durable queues/background workers only when execution volume requires it.
