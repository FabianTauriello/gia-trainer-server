"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const Constants_1 = require("./Constants");
var Utils;
(function (Utils) {
    // TODO consider a better implementation here because CATEGORY_SORT_ORDER is of type 'any'
    function sortQuestionsByCategory(questions) {
        const copy = [...questions];
        copy.sort((a, b) => {
            const sortResult = (Constants_1.CATEGORY_SORT_ORDER[a.category] || Constants_1.CATEGORY_SORT_ORDER.default) -
                (Constants_1.CATEGORY_SORT_ORDER[b.category] || Constants_1.CATEGORY_SORT_ORDER.default) || a.category.localeCompare(b.category);
            if (sortResult === 0) {
                return 1;
            }
            else {
                return sortResult;
            }
        });
        return copy;
    }
    Utils.sortQuestionsByCategory = sortQuestionsByCategory;
    function isNewUser(obj) {
        if (typeof obj === "object" && obj !== null) {
            return (typeof obj.email === "string" &&
                typeof obj.password === "string" &&
                typeof obj.firstName === "string" &&
                typeof obj.lastName === "string");
        }
        return false;
    }
    Utils.isNewUser = isNewUser;
    function isLoginCredentials(obj) {
        if (typeof obj === "object" && obj !== null) {
            return typeof obj.email === "string" && typeof obj.password === "string";
        }
        return false;
    }
    Utils.isLoginCredentials = isLoginCredentials;
})(Utils = exports.Utils || (exports.Utils = {}));
