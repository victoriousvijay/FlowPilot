# Deployment

## GitHub
Keep the project in Git.

Before pushing:
```bash
git status
git add .
git commit -m "Build AI automation generator MVP"
git push
```

Do not commit secrets.

## Vercel
Connect the GitHub repository to Vercel or deploy with the Vercel CLI.

Required production environment variables:
```text
ANTHROPIC_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Use the actual environment variables required by the implemented code. Do not invent credentials.

## Production checklist
- [ ] Build succeeds
- [ ] Environment variables exist
- [ ] Supabase migrations applied
- [ ] Auth works
- [ ] AI generation works server-side
- [ ] Workflow validation works
- [ ] Test execution works
- [ ] Webhook endpoint works if enabled
- [ ] No secrets in client bundle
- [ ] GitHub is updated
- [ ] Vercel deployment succeeds

## Deployment philosophy
Do not spend excessive time on hypothetical production issues. Fix concrete build/runtime/deployment blockers and ship.
