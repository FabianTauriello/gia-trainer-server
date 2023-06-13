import { Question, QuizAttempt } from "domain/Types";

// this questions array is similar to one obtained from server
const questions = [
  // Reasoning
  {
    number: 1,
    category: "Reasoning" as const,
    statement: "Rebecca is louder than Kate",
    question: "Who is less loud?",
    choices: ["Rebecca", "Kate"],
    correctChoiceIndex: 1,
    selectedChoiceIndex: 1,
  },
  {
    number: 2,
    category: "Reasoning" as const,
    statement: "Tracy has more money than Stephen",
    question: "Who is poorer?",
    choices: ["Tracy", "Stephen"],
    correctChoiceIndex: 1,
    selectedChoiceIndex: 0,
  },
  {
    number: 3,
    category: "Reasoning" as const,
    statement: "Stewart is stronger than Joe",
    question: "Who is stronger?",
    choices: ["Stewart", "Joe"],
    correctChoiceIndex: 0,
    selectedChoiceIndex: 1,
  },
  {
    number: 4,
    category: "Reasoning" as const,
    statement: "Joshua is not as flexible as Chris",
    question: "Who is less adaptable?",
    choices: ["Joshua", "Chris"],
    correctChoiceIndex: 0,
    selectedChoiceIndex: 0,
  },
  {
    number: 5,
    category: "Reasoning" as const,
    statement: "Bob is not as happy as Paul",
    question: "Who is sadder?",
    choices: ["Bob", "Paul"],
    correctChoiceIndex: 0,
    selectedChoiceIndex: 0,
  },
  // Perceptual Speed
  {
    number: 6,
    category: "Perceptual Speed" as const,
    pairs: [
      ["f", "F"],
      ["d", "D"],
      ["m", "R"],
      ["h", "H"],
    ],
    choices: ["0", "1", "2", "3", "4"],
    correctChoiceIndex: 3,
    selectedChoiceIndex: 3,
  },
  // Number Speed and Accuracy
  {
    number: 7,
    category: "Number Speed and Accuracy" as const,
    choices: ["4", "2", "8"],
    correctChoiceIndex: 2,
    selectedChoiceIndex: 0,
  },
  {
    number: 8,
    category: "Number Speed and Accuracy" as const,
    choices: ["12", "3", "5"],
    correctChoiceIndex: 0,
    selectedChoiceIndex: 0,
  },
  {
    number: 9,
    category: "Number Speed and Accuracy" as const,
    choices: ["10", "7", "5"],
    correctChoiceIndex: 0,
    selectedChoiceIndex: 0,
  },
  {
    number: 10,
    category: "Number Speed and Accuracy" as const,
    choices: ["11", "13", "16"],
    correctChoiceIndex: 2,
    selectedChoiceIndex: 2,
  },
  // Word Meaning
  {
    number: 11,
    category: "Word Meaning" as const,
    choices: ["halt", "cold", "stop"],
    correctChoiceIndex: 1,
    selectedChoiceIndex: 1,
  },
  {
    number: 12,
    category: "Word Meaning" as const,
    choices: ["up", "down", "street"],
    correctChoiceIndex: 2,
    selectedChoiceIndex: 2,
  },
  {
    number: 13,
    category: "Word Meaning" as const,
    choices: ["below", "under", "letter"],
    correctChoiceIndex: 2,
    selectedChoiceIndex: 0,
  },
  // Spatial Visualisation
  {
    number: 14,
    category: "Spatial Visualisation" as const,
    letters: [
      [
        {
          char: "R",
          rot: 180,
          flip: false,
        },
        {
          char: "R",
          rot: -90,
          flip: true,
        },
      ],
      [
        {
          char: "R",
          rot: 90,
          flip: false,
        },
        {
          char: "R",
          rot: -90,
          flip: false,
        },
      ],
    ],
    choices: ["0", "1", "2"],
    correctChoiceIndex: 1,
    selectedChoiceIndex: 1,
  },
];

export const testAttempt: QuizAttempt = {
  id: "visitor",
  questions: questions,
  totalScore: 0,
};
