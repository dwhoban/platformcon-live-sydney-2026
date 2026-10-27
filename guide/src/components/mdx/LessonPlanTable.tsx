import { Table } from "@cloudflare/kumo/components/table";
import type { GuidePage } from "../../lib/guide";

/** Rendered as one React tree: Astro would break table markup if each part rendered separately. */
export default function LessonPlanTable({ lessons }: { lessons: GuidePage[] }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg ring ring-kumo-line">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Step</Table.Head>
            <Table.Head>Lesson</Table.Head>
            <Table.Head>What you add</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {lessons.map((lesson) => (
            <Table.Row key={lesson.id}>
              <Table.Cell className="tabular-nums text-kumo-subtle">{lesson.lesson}</Table.Cell>
              <Table.Cell>
                <a href={lesson.href} className="font-medium text-kumo-link hover:underline">
                  {lesson.title}
                </a>
              </Table.Cell>
              <Table.Cell className="text-kumo-subtle">{lesson.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
