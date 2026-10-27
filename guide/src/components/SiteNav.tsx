import { Button, LinkButton } from "@cloudflare/kumo/components/button";
import { CloudflareLogo } from "@cloudflare/kumo/components/cloudflare-logo";
import { Sidebar, useSidebar } from "@cloudflare/kumo/components/sidebar";
import { cn } from "@cloudflare/kumo/utils";
import { ArrowSquareOutIcon, DownloadSimpleIcon, ListIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { GuideGroup } from "../lib/guide";
import { type NavLink, navLinks, site } from "../site.config";
import SearchDialog from "./SearchDialog";
import ThemeToggle from "./ThemeToggle";

interface Props {
  groups: GuideGroup[];
  currentPath: string;
  children?: ReactNode;
}

const resourceLinks = navLinks.filter((link) => link.external || link.download);

function linkAttributes(link: NavLink) {
  if (link.external) return { target: "_blank", rel: "noopener noreferrer" };
  if (link.download) return { download: "", "data-astro-prefetch": "false" };
  return {};
}

function LinkIcon({ link }: { link: NavLink }) {
  if (link.external) return <ArrowSquareOutIcon className="size-3.5 shrink-0 text-kumo-subtle" />;
  if (link.download) return <DownloadSimpleIcon className="size-3.5 shrink-0 text-kumo-subtle" />;
  return null;
}

function Brand({ showEvent = false, className }: { showEvent?: boolean; className?: string }) {
  return (
    <a href="/" className={cn("flex min-w-0 items-center gap-2.5 rounded-lg px-1 py-1", className)}>
      <CloudflareLogo variant="glyph" className="w-8 shrink-0" aria-hidden />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-base font-semibold text-kumo-default">{site.title}</span>
        {showEvent && <span className="truncate text-xs text-kumo-subtle">{site.event}</span>}
      </span>
    </a>
  );
}

function MobileMenuButton() {
  const { setOpenMobile } = useSidebar();
  return (
    <Button
      variant="ghost"
      shape="square"
      icon={ListIcon}
      aria-label="Open navigation"
      className="md:hidden"
      onClick={() => setOpenMobile(true)}
    />
  );
}

/** Page frame: sidebar, sticky header and the main content slot, as one island. */
export default function SiteNav({ groups, currentPath, children }: Props) {
  return (
    <Sidebar.Provider collapsible="offcanvas">
      <Sidebar aria-label="Guide navigation" className="md:sticky md:top-0 md:h-svh md:self-start">
        <Sidebar.Header className="justify-between">
          <Brand showEvent />
          <Sidebar.Close className="md:hidden" />
        </Sidebar.Header>
        <Sidebar.Content>
          {groups.map((group) => (
            <Sidebar.Group key={group.id}>
              <Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
              <Sidebar.Menu>
                {group.pages.map((page) => {
                  const active = page.href === currentPath;
                  return (
                    <Sidebar.MenuButton
                      key={page.id}
                      href={page.href}
                      active={active}
                      aria-current={active ? "page" : undefined}
                    >
                      {page.lesson && <span className="text-kumo-subtle tabular-nums">{page.lesson}</span>}
                      {page.label}
                      {page.draft && <Sidebar.MenuBadge>Draft</Sidebar.MenuBadge>}
                    </Sidebar.MenuButton>
                  );
                })}
              </Sidebar.Menu>
            </Sidebar.Group>
          ))}
          <Sidebar.Group className="lg:hidden">
            <Sidebar.GroupLabel>Resources</Sidebar.GroupLabel>
            <Sidebar.Menu>
              {resourceLinks.map((link) => (
                <Sidebar.MenuButton key={link.href} href={link.href} {...linkAttributes(link)}>
                  {link.label}
                  <LinkIcon link={link} />
                </Sidebar.MenuButton>
              ))}
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[58px] shrink-0 items-center gap-2 border-b border-kumo-line bg-kumo-base px-3 md:px-6">
          <MobileMenuButton />
          <Brand className="md:hidden" />
          <div className="ml-auto md:ml-0">
            <SearchDialog />
          </div>
          <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <LinkButton key={link.href} href={link.href} size="sm" {...linkAttributes(link)}>
                {link.label}
                <LinkIcon link={link} />
              </LinkButton>
            ))}
          </nav>
          <div className="md:ml-auto lg:ml-0">
            <ThemeToggle />
          </div>
        </header>
        <main id="content" className="flex-1">
          {children}
        </main>
      </div>
    </Sidebar.Provider>
  );
}
