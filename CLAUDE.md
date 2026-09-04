# AI Automation Generator — Claude Code Instructions

## Mission
Build an AI-first automation platform where a user describes an automation in natural language and the product converts it into a validated workflow that can be visually inspected, edited, saved, tested, and executed.

## Source of truth
Before building, read all relevant `.md` files in this directory/repository. Treat the documentation as the source of truth. Do not ask the user to repeat requirements already documented.

## Execution mode
- Read the docs once, understand the architecture, then start building immediately.
- Do not spend tokens on long plans, repeated explanations, ceremonial reviews, or unnecessary confirmation.
- Do not repeat completed work.
- Reuse existing files, components, utilities, schemas, and integrations when they already satisfy requirements.
- Keep responses concise and execution-focused.
- Do not proactively refactor or debug unrelated code.
- Only fix actual blocking type, build, runtime, integration, or deployment errors.
- Continue through the whole implementation unless a genuinely blocking decision, credential, environment variable, destructive action, or external limitation requires user input.

## Required implementation flow
1. Inspect repository and existing code.
2. Read relevant MD documentation.
3. Implement the MVP end-to-end.
4. Validate only what is necessary to ensure the feature works.
5. Fix actual blocking errors.
6. Commit meaningful changes.
7. Push to the existing GitHub repository.
8. Deploy to Vercel when configured.
9. Report only the final result, important blockers, and deployment URL.

## Product principles
- AI-first, not node-first.
- Natural language is the primary input.
- Workflow JSON is the canonical internal representation.
- Validate every AI-generated workflow before execution.
- Never expose secrets or API keys to the browser.
- Make integrations modular so new connectors can be added without rewriting the core.
- Prefer simple, maintainable architecture over premature enterprise complexity.

## Initial stack
- Next.js + TypeScript
- Tailwind CSS + shadcn/ui
- React Flow for visual workflow editing
- Supabase/Postgres for persistence and auth
- Anthropic API for workflow generation and AI steps
- Zod for runtime validation
- Vercel for deployment
- GitHub for source control

## Initial integrations
Implement only:
- Webhook
- Gmail
- Google Sheets
- Slack
- Anthropic

Do not expand the integration list until the core generation/edit/save/test flow works.

## AI rules
The model must output structured workflow data matching the application schema. Never trust arbitrary model text as executable instructions.

Use server-side Anthropic calls only:
`Browser -> Next.js server -> Anthropic`

Use environment variables for secrets.

## UX rules
The main experience should be:
1. "What do you want to automate?"
2. User describes it.
3. Generate automation.
4. Show visual workflow.
5. Let user edit/test.
6. Save and activate.

Do not make the user understand technical node terminology unless they open the advanced editor.

## Definition of done
A feature is done when it works in the existing app, is integrated with the documented architecture, does not expose secrets, and does not introduce a known blocking build/runtime issue.

Do not create unnecessary documentation or duplicate specifications while implementing.
