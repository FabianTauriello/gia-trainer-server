import { Question } from "../domain/types";
import { SECTION_SORT_ORDER } from "./Constants";

// TODO consider a better implementation here because SECTION_SORT_ORDER is of type 'any'
export function sortQuestionsBySection(questions: Question[]) {
  const copy = [...questions];
  copy.sort((a, b) => {
    const sortResult =
      (SECTION_SORT_ORDER[a.section] || SECTION_SORT_ORDER.default) -
        (SECTION_SORT_ORDER[b.section] || SECTION_SORT_ORDER.default) || a.section.localeCompare(b.section);
    if (sortResult === 0) {
      return 1;
    } else {
      return sortResult;
    }
  });

  return copy;
}
