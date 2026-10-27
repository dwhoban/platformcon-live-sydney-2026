import type { AgentTestObject } from "./worker";

declare global {
  namespace Cloudflare {
    interface Env {
      AGENT_TEST: DurableObjectNamespace<AgentTestObject>;
    }
  }
}

export {};
