import { Button } from "@cloudflare/kumo/components/button";
import { CommandPalette } from "@cloudflare/kumo/components/command-palette";
import { FileTextIcon, HashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState, useSyncExternalStore } from "react";

interface PagefindSection {
  title: string;
  url: string;
  excerpt: string;
}

interface PagefindPage extends PagefindSection {
  meta: { title?: string; group?: string };
  sub_results?: PagefindSection[];
}

interface Pagefind {
  search(term: string): Promise<{ results: { data(): Promise<PagefindPage> }[] }>;
}

interface Hit {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  isPage: boolean;
}

interface HitGroup {
  id: string;
  label: string;
  items: Hit[];
}

const MAX_PAGES = 8;
const MAX_SECTIONS_PER_PAGE = 3;
// Kept in a variable so Vite leaves the import alone; the file only exists after a build.
const PAGEFIND_URL = "/pagefind/pagefind.js";

let pagefind: Promise<Pagefind> | undefined;

function loadPagefind() {
  pagefind ??= import(/* @vite-ignore */ PAGEFIND_URL).catch((error: unknown) => {
    pagefind = undefined;
    throw error;
  });
  return pagefind;
}

// Pagefind indexes the built .html files; the Worker serves them without the extension.
const cleanUrl = (url: string) => url.replace(/\.html(?=#|$)/, "");

function toGroup(page: PagefindPage): HitGroup {
  const title = page.meta.title ?? cleanUrl(page.url);
  const sections = page.sub_results?.length
    ? page.sub_results.slice(0, MAX_SECTIONS_PER_PAGE)
    : [{ title, url: page.url, excerpt: page.excerpt }];
  return {
    id: page.url,
    label: [page.meta.group, title].filter(Boolean).join(" › "),
    items: sections.map((section) => ({
      id: section.url,
      url: cleanUrl(section.url),
      title: section.title,
      excerpt: section.excerpt,
      isPage: !section.url.includes("#"),
    })),
  };
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
  );
}

const noopSubscribe = () => () => {};

function useIsApple() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => true,
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-kumo-line bg-kumo-base px-1 font-sans text-xs text-kumo-subtle">
      {children}
    </kbd>
  );
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<HitGroup[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const isApple = useIsApple();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !isTyping(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (import.meta.env.DEV || !term) {
      setGroups([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const { results } = await (await loadPagefind()).search(term);
        const pages = await Promise.all(results.slice(0, MAX_PAGES).map((result) => result.data()));
        if (cancelled) return;
        setGroups(pages.map(toGroup));
        setStatus("idle");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const openHit = (hit: Hit, newTab: boolean) => {
    if (newTab) {
      window.open(hit.url, "_blank", "noopener");
      return;
    }
    setOpen(false);
    window.location.assign(hit.url);
  };

  let emptyMessage: ReactNode = "Type to search the guide.";
  if (status === "error") emptyMessage = "Search couldn't load. Try again.";
  else if (query.trim()) emptyMessage = `No results for “${query.trim()}”`;

  return (
    <>
      <Button
        variant="secondary"
        icon={MagnifyingGlassIcon}
        className="hidden w-56 text-kumo-subtle md:flex"
        onClick={() => setOpen(true)}
      >
        <span className="flex-1 text-left">Search</span>
        <Kbd>{isApple ? "⌘K" : "Ctrl K"}</Kbd>
      </Button>
      <Button
        variant="ghost"
        shape="square"
        icon={MagnifyingGlassIcon}
        aria-label="Search"
        className="md:hidden"
        onClick={() => setOpen(true)}
      />

      <CommandPalette.Root
        open={open}
        onOpenChange={setOpen}
        items={groups}
        value={query}
        onValueChange={setQuery}
        itemToStringValue={(group) => group.label}
        getSelectableItems={(all) => all.flatMap((group) => group.items)}
        onSelect={(hit) => openHit(hit, true)}
      >
        <CommandPalette.Input placeholder="Search the guide" aria-label="Search the guide" />
        <CommandPalette.List>
          {import.meta.env.DEV ? (
            <p className="p-8 text-center text-kumo-subtle">
              Search runs against the built site. Use <code>pnpm preview</code> to try it.
            </p>
          ) : status === "loading" && groups.length === 0 ? (
            <CommandPalette.Loading />
          ) : (
            <>
              <CommandPalette.Results>
                {(group: HitGroup) => (
                  <CommandPalette.Group key={group.id} items={group.items}>
                    <CommandPalette.GroupLabel>{group.label}</CommandPalette.GroupLabel>
                    <CommandPalette.Items>
                      {(hit: Hit) => (
                        <CommandPalette.Item
                          key={hit.id}
                          value={hit}
                          className="items-start"
                          onClick={(event) => openHit(hit, event.metaKey || event.ctrlKey)}
                        >
                          {hit.isPage ? (
                            <FileTextIcon className="mt-0.5 size-4 shrink-0 text-kumo-subtle" />
                          ) : (
                            <HashIcon className="mt-0.5 size-4 shrink-0 text-kumo-subtle" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-kumo-default">{hit.title}</span>
                            {hit.excerpt && (
                              <span
                                className="mt-0.5 line-clamp-2 text-sm text-kumo-subtle [&_mark]:rounded-sm [&_mark]:bg-kumo-warning/50 [&_mark]:text-kumo-default"
                                // Pagefind escapes page text and only adds <mark> tags.
                                dangerouslySetInnerHTML={{ __html: hit.excerpt }}
                              />
                            )}
                          </span>
                        </CommandPalette.Item>
                      )}
                    </CommandPalette.Items>
                  </CommandPalette.Group>
                )}
              </CommandPalette.Results>
              <CommandPalette.Empty>{emptyMessage}</CommandPalette.Empty>
            </>
          )}
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd> to open
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd> to close
          </span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </>
  );
}
