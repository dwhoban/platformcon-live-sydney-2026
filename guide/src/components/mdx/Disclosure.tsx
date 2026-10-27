import { Collapsible } from "@cloudflare/kumo/components/collapsible";
import type { ReactNode } from "react";

interface Props {
  summary: string;
  open?: boolean;
  children?: ReactNode;
}

export default function Disclosure({ summary, open = false, children }: Props) {
  return (
    <Collapsible.Root defaultOpen={open} className="my-5">
      <Collapsible.DefaultTrigger>{summary}</Collapsible.DefaultTrigger>
      {/* Stays in the HTML while closed, so search and find-in-page can reach it. */}
      <Collapsible.DefaultPanel hiddenUntilFound>{children}</Collapsible.DefaultPanel>
    </Collapsible.Root>
  );
}
