import { type CollectionEntry, getCollection } from "astro:content";
import { type GroupId, groupIds, groupLabels } from "../site.config";

export type GuideEntry = CollectionEntry<"guide">;

/** Serializable page summary, safe to pass to client islands. */
export interface GuidePage {
  id: string;
  href: string;
  title: string;
  label: string;
  /** Two-digit lesson number, e.g. "04". */
  lesson?: string;
  group: GroupId;
  description?: string;
  draft: boolean;
}

export interface GuideGroup {
  id: GroupId;
  label: string;
  pages: GuidePage[];
}

export const hrefFor = (id: string) => (id === "index" ? "/" : `/${id}`);

export const formatLesson = (lesson: number) => String(lesson).padStart(2, "0");

function compare(a: GuideEntry, b: GuideEntry) {
  return (
    groupIds.indexOf(a.data.group) - groupIds.indexOf(b.data.group) ||
    Number(a.data.draft) - Number(b.data.draft) ||
    (a.data.lesson ?? -1) - (b.data.lesson ?? -1) ||
    a.data.title.localeCompare(b.data.title)
  );
}

/** Entries in reading order. Drafts are only included under `astro dev`. */
export async function getGuideEntries(): Promise<GuideEntry[]> {
  const entries = await getCollection("guide", ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort(compare);
}

export async function getGuidePages(): Promise<GuidePage[]> {
  return (await getGuideEntries()).map(({ id, data }) => ({
    id,
    href: hrefFor(id),
    title: data.title,
    label: data.sidebarLabel ?? data.title,
    lesson: data.lesson === undefined ? undefined : formatLesson(data.lesson),
    group: data.group,
    description: data.description,
    draft: data.draft,
  }));
}

export function groupPages(pages: GuidePage[]): GuideGroup[] {
  return groupIds
    .map((id) => ({ id, label: groupLabels[id], pages: pages.filter((page) => page.group === id) }))
    .filter((group) => group.pages.length > 0);
}

/** Neighbouring pages in reading order, skipping drafts. */
export function getPrevNext(pages: GuidePage[], id: string) {
  const published = pages.filter((page) => !page.draft);
  const index = published.findIndex((page) => page.id === id);
  if (index === -1) return {};
  return { prev: published[index - 1], next: published[index + 1] };
}
