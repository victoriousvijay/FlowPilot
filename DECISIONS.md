# Architecture Decisions

## 1. Workflow JSON is canonical
The visual canvas is a representation of the workflow, not the source of truth.

## 2. AI is a planner, not an unrestricted executor
Claude chooses supported integrations/actions and produces structured workflow data. The application validates and executes it.

## 3. Server-side AI
Anthropic credentials remain on the server.

## 4. Modular integrations
Each provider lives behind an adapter/registry boundary.

## 5. Start small
Five integrations are enough to prove the core product. More integrations come after the generation experience works.

## 6. Avoid premature distributed architecture
Use the simplest execution model that works for MVP. Introduce queues/workers when real workload requires them.

## 7. n8n is not assumed as a code dependency
If n8n is evaluated as an execution backend, licensing and commercial distribution rights must be reviewed before incorporation.
