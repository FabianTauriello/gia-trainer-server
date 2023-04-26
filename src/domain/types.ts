export type Question = {
  number: number;
  category: string;
  pairs?: string[][];
  letters?: Letter[][];
  statement?: string;
  question?: string;
  choices: string[];
  correctChoiceIndex: number;
};

type Letter = {
  char: string;
  rot: number;
  flip: boolean;
};
