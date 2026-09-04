# Development Workflow

## Start
1. Inspect repository.
2. Read all relevant MD files.
3. Inspect package.json and existing architecture.
4. Reuse existing infrastructure.
5. Implement the smallest complete vertical slice.

## Build order

### Phase 1 — Foundation
- Next.js app
- Tailwind/shadcn
- environment handling
- Supabase connection
- shared types
- Zod schemas

### Phase 2 — AI generation
- server-side Anthropic client
- workflow generation prompt
- structured response validation
- clear validation errors
- generation API

### Phase 3 — Visual editor
- React Flow
- workflow-to-node conversion
- node editing
- add/remove/reorder steps
- save workflow

### Phase 4 — Execution
- execution service
- integration adapter interface
- Webhook
- Anthropic
- basic Google Sheets/Gmail/Slack adapters
- execution logs

### Phase 5 — Product completion
- authentication
- workflow dashboard
- workflow detail
- test mode
- activate/deactivate
- execution history

### Phase 6 — Deployment
- production env vars
- Vercel configuration
- build
- deployment
- GitHub push

## Working rules
- Work vertically rather than creating disconnected scaffolding.
- Keep API and secret handling server-side.
- Use typed schemas at boundaries.
- Avoid speculative abstractions.
- Do not build integrations before the core workflow model is stable.
- Do not rewrite existing working code without a reason.
