export const site = {
  title: "Agent golden path",
  event: "PlatformCon Live Sydney 2026",
  description: "5 defaults every agent needs: build an agent golden path on Cloudflare",
  sessionUrl:
    "https://sydney.platformcon.com/sessions/5-defaults-every-agent-needs-build-an-agent-golden-path-on-cloudflare",
  // TODO: point at the public workshop repository.
  repoUrl: "https://github.com/OWNER/REPO",
  downloadUrl: "/downloads/lab.zip",
} as const;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Guide", href: "/00-setup" },
  { label: "Download ZIP", href: site.downloadUrl, download: true },
  { label: "Code", href: site.repoUrl, external: true },
  { label: "Session", href: site.sessionUrl, external: true },
];

/** Sidebar groups, in reading order. */
export const groupIds = ["get-started", "template", "terraform", "ship"] as const;

export type GroupId = (typeof groupIds)[number];

export const groupLabels: Record<GroupId, string> = {
  "get-started": "Get started",
  template: "Build the template",
  terraform: "Provision with Terraform",
  ship: "Ship it",
};
