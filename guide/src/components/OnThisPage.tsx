import {
  TableOfContents,
  useTableOfContentsActiveId,
} from "@cloudflare/kumo/components/table-of-contents";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Section {
  heading: Heading;
  children: Heading[];
}

function toSections(headings: Heading[]): Section[] {
  const sections: Section[] = [];
  for (const heading of headings) {
    if (heading.depth === 2) sections.push({ heading, children: [] });
    else sections.at(-1)?.children.push(heading);
  }
  return sections;
}

/** "On this page" list for h2/h3 headings, highlighting the section in view. */
export default function OnThisPage({ headings }: { headings: Heading[] }) {
  const { activeId, selectSection } = useTableOfContentsActiveId({
    ids: headings.map((heading) => heading.slug),
    // Sticky header height plus breathing room; keep above `scroll-padding-top`.
    offset: 96,
  });

  const item = (heading: Heading) => (
    <TableOfContents.Item
      key={heading.slug}
      href={`#${heading.slug}`}
      active={activeId === heading.slug}
      onClick={() => selectSection(heading.slug)}
      className="overflow-visible text-pretty whitespace-normal"
    >
      {heading.text}
    </TableOfContents.Item>
  );

  return (
    <TableOfContents>
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        {toSections(headings).map(({ heading, children }) =>
          children.length === 0 ? (
            item(heading)
          ) : (
            <TableOfContents.Group
              key={heading.slug}
              label={heading.text}
              href={`#${heading.slug}`}
              active={activeId === heading.slug}
              onClick={() => selectSection(heading.slug)}
            >
              {children.map(item)}
            </TableOfContents.Group>
          ),
        )}
      </TableOfContents.List>
    </TableOfContents>
  );
}
