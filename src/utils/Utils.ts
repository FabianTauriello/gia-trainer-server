import { LoginCredentials, Question, User } from "../domain/Types";
import { CATEGORY_SORT_ORDER } from "./Constants";

export namespace Utils {
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

  export function isUser(obj: any): obj is User {
    if (typeof obj === "object" && obj !== null) {
      return (
        typeof obj.email === "string" &&
        typeof obj.password === "string" &&
        typeof obj.firstName === "string" &&
        typeof obj.lastName === "string"
      );
    }
    return false;
  }

  export function isLoginCredentials(obj: any): obj is LoginCredentials {
    if (typeof obj === "object" && obj !== null) {
      return typeof obj.email === "string" && typeof obj.password === "string";
    }
    return false;
  }
}
