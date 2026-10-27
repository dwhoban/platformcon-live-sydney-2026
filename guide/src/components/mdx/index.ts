import Callout from "./Callout";
import Details from "./Details.astro";
import H2 from "./H2.astro";
import H3 from "./H3.astro";
import LessonPlan from "./LessonPlan.astro";
import Pre from "./Pre.astro";

/** Passed to `<Content components={...} />`, so pages can use these without imports. */
export const mdxComponents = {
  h2: H2,
  h3: H3,
  pre: Pre,
  Callout,
  Details,
  LessonPlan,
};
