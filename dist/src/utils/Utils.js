"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortQuestionsBySection = void 0;
const Constants_1 = require("./Constants");
// TODO consider a better implementation here because SECTION_SORT_ORDER is of type 'any'
function sortQuestionsBySection(questions) {
    const copy = [...questions];
    copy.sort((a, b) => {
        const sortResult = (Constants_1.SECTION_SORT_ORDER[a.section] || Constants_1.SECTION_SORT_ORDER.default) -
            (Constants_1.SECTION_SORT_ORDER[b.section] || Constants_1.SECTION_SORT_ORDER.default) || a.section.localeCompare(b.section);
        if (sortResult === 0) {
            return 1;
        }
        else {
            return sortResult;
        }
    });
    return copy;
}
exports.sortQuestionsBySection = sortQuestionsBySection;
