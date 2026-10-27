# Agent golden path: Terraform

The platform side of the golden path. Given one agent name, this module
stamps out everything the agent gets:

| File | Lesson | Creates |
| --- | --- | --- |
| `ai_gateway.tf` | 05 | The agent's AI Gateway, with a rate limit and spend limits per agent and per user |
| `worker.tf` | 06 | The agent's Worker, on workers.dev and tagged `golden-path` |
| `github.tf` | 07 | The agent's repository from the template, with its deploy secrets and variables |

The starting point declares the providers (`versions.tf`, `providers.tf`)
and the inputs (`variables.tf`). You create the three files above while
following the guide.

```sh
cp terraform.tfvars.example terraform.tfvars   # then fill it in
terraform init
terraform apply
```

`terraform destroy` removes the agent again. Deleting its repository needs a
GitHub token with the `delete_repo` scope.
