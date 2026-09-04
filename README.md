# AI Automation Generator

An AI-first automation platform that turns natural-language instructions into structured, visual, executable automations.

## Core experience

User:
> Whenever I receive a new customer email, summarize it with AI, add the summary to Google Sheets, and notify Slack.

Product:
```text
Gmail
  ↓
Anthropic
  ↓
Google Sheets
  ↓
Slack
```

## MVP
- Natural-language automation generation
- Structured workflow JSON
- Zod validation
- React Flow visual editor
- Save workflows
- Test execution
- Basic execution history
- Anthropic integration
- Webhook, Gmail, Google Sheets, and Slack connectors
- Supabase persistence/auth
- GitHub + Vercel deployment

## Important
This project is designed as an independent product. Do not assume that n8n source code can be copied, modified, or commercially redistributed. If n8n is considered for the execution layer, review its current license and obtain appropriate rights before incorporating or distributing its code.

## Environment variables

```env
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit `.env`, `.env.local`, or secrets.

## Product positioning

Primary promise:
**Describe it. We automate it.**

The AI generation experience is the differentiator; the visual workflow editor is the control surface.
