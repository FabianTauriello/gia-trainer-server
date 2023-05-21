export type Question = {
  number: number;
  category: string;
  pairs?: string[][];
  letters?: Letter[][];
  statement?: string;
  question?: string;
  choices: string[];
  correctChoiceIndex: number;
  selectedChoiceIndex: number;
};

type Letter = {
  char: string;
  rot: number;
  flip: boolean;
};

export type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
