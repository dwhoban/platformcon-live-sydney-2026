# Agent template

A golden path template for AI agents on Cloudflare. Every agent stamped from
it gets five controls by default:

| Default | How this template does it |
| --- | --- |
| Its own identity | One Worker and one AI Gateway per agent, and one Durable Object (`Agent`) per user. Every model call is tagged with `agent_id` and `user_id`. |
| Scoped access to tools | The model is only offered the tools in `TOOLS` (`src/server.ts`). `exec` runs in a Dynamic Worker with no network access. |
| Approval gates before write actions | Tools in `APPROVAL_REQUIRED` wait until an operator approves or rejects them in the UI (`src/approvals.ts`). |
| Hard usage limits | The agent's AI Gateway enforces a request rate limit and spend limits per agent and per user. `limits.cpu_ms` caps CPU per request. |
| End-to-end tracing | Workers Logs and Traces from `observability` in `wrangler.jsonc`, plus AI Gateway logs filterable by `agent_id` and `user_id`. |

The agent itself is the [Pi harness](https://developers.cloudflare.com/agents/harnesses/pi/)
from the Agents SDK (`agents/harness/pi`), running Workers AI through the `AI`
binding, with a durable workspace from `@cloudflare/computer`.

The PlatformCon Live Sydney 2026 workshop builds these controls into the
template step by step.

## Run locally

```sh
pnpm install
pnpm start
```

Open the URL Vite prints. The `AI` binding is remote, so local runs use
Workers AI on your account. If your Wrangler login can see more than one
account, set `CLOUDFLARE_ACCOUNT_ID` first.

Try the suggestions on the empty screen. Each one exercises a control:

- **Write a file**: `write` waits for you to approve it.
- **Delete a file**: `delete` is not offered. Watch the model reach for
  `exec` instead, and the gate catch it.
- **Fetch a URL**: `exec` runs, and the sandbox refuses the network call.
- **Run JavaScript**: then open the trace in the Local Explorer at
  `/cdn-cgi/local/explorer/observability`.

## Stamp an agent

This repository is a GitHub template. A platform team stamps agents from it
with Terraform (see the workshop's `terraform/` folder), which creates the
agent's AI Gateway, Worker and repository, and sets these on the repository:

| Name | Kind | Used for |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secret | `wrangler deploy` |
| `CLOUDFLARE_ACCOUNT_ID` | Secret | `wrangler deploy` |
| `AGENT_NAME` | Variable | Worker name and `AGENT_ID` |
| `AI_GATEWAY_ID` | Variable | The agent's AI Gateway |

`.github/workflows/deploy.yml` deploys on every push to `main`, and on
demand with `gh workflow run deploy.yml`. It does nothing in the template
repository itself, which has no `AGENT_NAME`.

## Test

```sh
pnpm test
```

The tests run real Durable Objects with a scripted model: the socket
protocol, the client's view and outbox, and the workspace tools.

## Licenses

Pi is MIT licensed; see [`licenses/mit-earendil-pi.txt`](./licenses/mit-earendil-pi.txt).
