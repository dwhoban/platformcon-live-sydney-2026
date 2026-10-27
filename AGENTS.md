#PlatformCon Live Sydney

Title: 5 defaults every agent needs: build an agent golden path on Cloudflare
Date: 28 October 2026
Time: 1:30pm AEDT
Duration: 60mins
Link: https://sydney.platformcon.com/sessions/5-defaults-every-agent-needs-build-an-agent-golden-path-on-cloudflare
Summary: Most platform teams are shipping AI agents with the same defaults as a CRUD service: shared credentials, no spend ceiling, no human in the loop, and no way to trace what the agent actually did. That works until an agent with write access makes ten thousand decisions overnight.

In this hands-on workshop, you'll build a golden path template that gives every new agent five controls by default: its own identity, scoped access to tools, approval gates before write actions, hard usage limits, and end-to-end tracing. Then you'll deploy an agent through it and watch each control fire.

You will leave with:

- A working template you can adapt for your own platform
- A clear model of what an agent golden path must provide, independent of vendor
- The 3 adoption metrics worth tracking from day one

## Folder Structure
|- guide/ Lab documentation for users to follow using @cloudlfare/kumo design system.
|- lab/ starting point for the golden path
|--- template/  starting point for agent template to be consumed by terraform
|--- terraform/ terraform module to deploy the golden path

## Cloudflare Account

Each attendee will be provided with a labs.cloudflare.com account correctly entitled with its own zone.



## Session Flow
1. Intros and overview
2. Template Setup: AI Gateway, Vars and Wrangler.jsonc
3. Template Setup: Github Actions
4. Tempalte Setup: Create Template Repo & Push
5. Terraform: Create AI Gateway
6. Terraform: Create Worker
6. Terraform: Create Repo + Secrets etc
7. Trigger Deploy

## Lessons

`guide/src/content/guide/`: `00-setup`, `01-template-config`, `02-scope-and-approve`, `03-github-actions`, `04-template-repo`, `05-ai-gateway`, `06-worker`, `07-repo-secrets`, `08-deploy`, `09-wrap-up`. Cut line if late: `06-worker` (Wrangler creates the Worker on first deploy).

`lab/template` and `lab/terraform` are the starting point. Paste points in the template are marked `// Lesson 01` and `// Lesson 02`; lesson 02 creates `src/approvals.ts`, lesson 03 creates `.github/workflows/deploy.yml`, lessons 05–07 create `ai_gateway.tf`, `worker.tf` and `github.tf`. Code in the lessons must reproduce the finished files exactly.

## The 5 defaults on Cloudflare

| Default | Cloudflare feature | Lesson |
| --- | --- | --- |
| Its own identity | Worker + AI Gateway per agent, Durable Object per user, `agent_id` / `user_id` AI Gateway metadata, CI `--name` / `--var` | 01, 05, 06, 07 |
| Scoped access to tools | `TOOLS` allowlist; `exec` in a Dynamic Worker (`worker_loaders`) with no internet | 02 |
| Approval gates | `ApprovalGate` parks the tool call in the Durable Object; Approve / Reject over WebSocket | 02 |
| Hard usage limits | AI Gateway rate limit + spend limits (gateway-wide and per `user_id`), `limits.cpu_ms` | 01, 05 |
| End-to-end tracing | `observability` logs + traces, AI Gateway logs | 01 |
