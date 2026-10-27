import type { JsonValue } from "@earendil-works/pi-ai";
import type {
  AgentEvent,
  JsonObject,
  UserInput
} from "@earendil-works/pi-durable";
import type { PiSessionId, PiWhenBusy } from "agents/harness/pi";

/**
 * This app's WebSocket protocol, served by `sockets.ts`. The harness knows
 * nothing about it: it is one way to put `session.events()` and
 * `session.submit()` on a socket.
 */

export type PiToolInfo = {
  readonly name: string;
  readonly description: string;
};

/**
 * What a tool parked behind an approval gate publishes through
 * `api.details()`, so clients can show an Approve / Reject card.
 */
export type ApprovalDetails = {
  readonly approval: "pending" | "approved" | "denied";
  readonly args: JsonObject;
};

/** Client → server. Commands with an `id` get a `result` or `error` back. */
export type PiClientMessage =
  | {
      readonly type: "submit";
      readonly id?: string;
      readonly input: UserInput;
      readonly whenBusy?: PiWhenBusy;
      readonly operationId?: string;
    }
  | { readonly type: "abort"; readonly id?: string }
  | { readonly type: "reset"; readonly id?: string; readonly handoff?: string }
  /** Ask for a fresh snapshot. */
  | { readonly type: "resync"; readonly id?: string }
  /** Settle a tool call parked behind the approval gate. */
  | {
      readonly type: "approve";
      readonly id?: string;
      readonly callId: string;
      readonly approved: boolean;
    };

/** Server → client. */
export type PiServerMessage =
  | {
      readonly type: "hello";
      readonly session: PiSessionId;
      readonly tools: readonly PiToolInfo[];
      /** Tool names that wait for operator approval before they run. */
      readonly approvalRequired: readonly string[];
    }
  /**
   * pi's own agent events for the connection's session. The first batch of a
   * watch, and any batch after the server lost its watch, starts with a
   * `snapshot` event that replaces the client's state.
   */
  | {
      readonly type: "events";
      readonly session: PiSessionId;
      readonly events: readonly AgentEvent[];
    }
  | { readonly type: "result"; readonly id: string; readonly result: JsonValue }
  | { readonly type: "error"; readonly id?: string; readonly message: string };

export type {
  PiClientMessage as ClientMessage,
  PiServerMessage as ServerMessage,
  PiToolInfo as ToolInfo
};
export type {
  PiMessage as TranscriptMessage,
  PiMessagePart as TranscriptPart
} from "./transcript";
export type { PiSessionView as SessionView } from "./view";
