import { Question } from "../domain/types";
import { CATEGORY_SORT_ORDER } from "./Constants";

// TODO consider a better implementation here because CATEGORY_SORT_ORDER is of type 'any'
export function sortQuestionsByCategory(questions: Question[]) {
  const copy = [...questions];
  copy.sort((a, b) => {
    const sortResult =
      (CATEGORY_SORT_ORDER[a.category] || CATEGORY_SORT_ORDER.default) -
        (CATEGORY_SORT_ORDER[b.category] || CATEGORY_SORT_ORDER.default) || a.category.localeCompare(b.category);
    if (sortResult === 0) {
      return 1;
    } else {
      return sortResult;
    }
  });

  return copy;
}
