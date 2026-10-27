import { Banner } from "@cloudflare/kumo/components/banner";
import { InfoIcon, LightbulbIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

const types = {
  note: { variant: "secondary", Icon: InfoIcon },
  tip: { variant: "default", Icon: LightbulbIcon },
  warning: { variant: "alert", Icon: WarningIcon },
  danger: { variant: "error", Icon: WarningOctagonIcon },
} as const;

interface Props {
  type?: keyof typeof types;
  title?: string;
  children?: ReactNode;
}

/** Server-rendered Kumo Banner for notes, tips and warnings. Ships no JavaScript. */
export default function Callout({ type = "note", title, children }: Props) {
  const { variant, Icon } = types[type];
  return (
    <Banner
      variant={variant}
      icon={<Icon weight="fill" size={16} />}
      title={title}
      description={children}
      className="callout not-prose my-5"
    />
  );
}
