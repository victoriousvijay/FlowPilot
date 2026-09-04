# Product Specification

## Vision
Make business automation accessible to non-technical users by allowing them to describe what they want in plain language.

## Target user
Small businesses, founders, marketers, sales teams, agencies, operators, and technical users who want faster automation creation.

## Core jobs
- Create an automation from natural language.
- Understand what the automation will do.
- Edit it without writing code.
- Connect required accounts.
- Test it.
- Activate it.
- See whether it succeeded or failed.
- Modify an existing automation using natural language.

## Primary user journey

### Create
Input:
"What do you want to automate?"

Example:
"Every time a website lead arrives, add it to Google Sheets and notify me in Slack."

### Generate
AI creates:
- trigger
- ordered steps
- conditions
- mappings
- required integrations
- human-readable explanation

### Review visually
Display a React Flow graph.

### Configure
Prompt the user to connect only the accounts required by the workflow.

### Test
Run with test/sample data and show step-level results.

### Activate
Persist workflow and enable its trigger.

### Modify
User can say:
"Only send Slack notifications for leads over $10,000."

AI modifies the existing structured workflow instead of regenerating everything from scratch.

## MVP non-goals
- 1,000+ integrations
- Full enterprise RBAC
- Marketplace
- Team billing
- Advanced scheduling
- Arbitrary user code execution
- Fully autonomous agents
- Complex branching engine beyond what MVP needs

## Success criteria
A new user should be able to describe a useful automation and reach a working test in a few minutes without understanding workflow-node concepts.
