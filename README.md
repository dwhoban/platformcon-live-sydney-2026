# 5 defaults every agent needs

Workshop materials for **[5 defaults every agent needs: build an agent golden path on Cloudflare](https://sydney.platformcon.com/sessions/5-defaults-every-agent-needs-build-an-agent-golden-path-on-cloudflare)**, PlatformCon Live Sydney, 28 October 2026.

Most platform teams ship AI agents with the same defaults as a CRUD service: shared credentials, no spend ceiling, no human in the loop, and no way to trace what the agent did. In this workshop you build a golden path that gives every new agent five controls by default, then stamp out an agent with it and watch each control fire.

## The five defaults

| Default | How Cloudflare provides it |
| --- | --- |
| Its own identity | A Worker and an AI Gateway per agent, a Durable Object per user, and `agent_id` / `user_id` metadata on every model call |
| Scoped access to tools | A tool allowlist, and `exec` running in a Dynamic Worker with no internet access |
| Approval gates before write actions | The Durable Object holds the tool call open until a person approves or rejects it over a WebSocket |
| Hard usage limits | AI Gateway rate limit and spend limits, per agent and per user, plus a CPU limit per request |
| End-to-end tracing | Workers Logs and Traces, and AI Gateway logs |

## Repository layout

```txt
guide/           the workshop guide: an Astro site deployed to Cloudflare Workers
lab/
  template/      the agent template attendees build on (lessons 03–06)
  terraform/     the Terraform module that stamps agents (lessons 01, 02 and 07)
```

`lab/` is the starting point attendees download. The guide zips it into `lab.zip` on every build.

## Follow the workshop

Open the guide and start at **Setup**. You need Node.js 22 or later, pnpm, the GitHub CLI, Terraform 1.9 or later, a GitHub account and a Cloudflare account.

| # | Lesson | What you add |
| --- | --- | --- |
| 00 | Setup | Tools, accounts, tokens and the lab folder |
| 01 | AI Gateway | A gateway per agent, with a rate limit and spend limits per agent and per user |
| 02 | Worker | The agent's Worker, on workers.dev and tagged `golden-path` |
| 03 | AI Gateway & config | Identity, a CPU limit and tracing, with every model call through the agent's gateway |
| 04 | Scoped tools & approvals | A tool allowlist, and an approval gate before write actions |
| 05 | GitHub Actions | A deploy workflow that ships each agent under its own name |
| 06 | Template repo & push | The template, published as a GitHub template repository |
| 07 | Repo & first deploy | The agent's repository, stamped from the template and deployed by one `terraform apply` |
| 08 | Wrap-up | Watch each control fire, and the three adoption metrics |

## Run the guide locally

```sh
cd guide
pnpm install
pnpm dev
```

`pnpm build` writes the static site and `public/downloads/lab.zip`. See [`guide/AGENTS.md`](./guide/AGENTS.md) for how pages are written and deployed.

## Run the agent template locally

```sh
cd lab/template
pnpm install
pnpm start
```

See [`lab/template/README.md`](./lab/template/README.md) and [`lab/terraform/README.md`](./lab/terraform/README.md).

## Licenses

The template includes Pi, which is MIT licensed: see [`lab/template/licenses/mit-earendil-pi.txt`](./lab/template/licenses/mit-earendil-pi.txt).
