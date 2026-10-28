# One name stamps the whole agent: its Worker, its AI Gateway and its
# GitHub repository.
variable "agent_name" {
  description = "The agent's name. Names its Worker, its AI Gateway and its GitHub repository."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,38}[a-z0-9]$", var.agent_name))
    error_message = "Use 3 to 40 lowercase letters, digits and hyphens, starting with a letter."
  }
}

variable "cloudflare_account_id" {
  description = "Your Cloudflare account ID. `npx wrangler whoami` prints it."
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token that can edit Workers and AI Gateway. The agent's deploy workflow uses it too."
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "Your GitHub username. It owns the template and the agent's repository."
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token (classic) with the repo and workflow scopes."
  type        = string
  sensitive   = true
}

variable "template_repo" {
  description = "The template repository you created in lesson 05."
  type        = string
  default     = "agent-template"
}

# Hard usage limits, enforced by the agent's AI Gateway.

variable "requests_per_minute" {
  description = "Model calls per minute, across the whole agent."
  type        = number
  default     = 20
}

variable "agent_budget_usd" {
  description = "The agent's model spend per day, in US dollars."
  type        = number
  default     = 10
}

variable "user_budget_usd" {
  description = "Each user's model spend per day, in US dollars."
  type        = number
  default     = 1
}
