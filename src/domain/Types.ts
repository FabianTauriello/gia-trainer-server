import { RowDataPacket } from "mysql2";

export type QuizAttempt = {
  id: string;
  questions: Question[];
  totalScore: number;
};

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
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UserDataRow = User & RowDataPacket;

export type SanitizedUser = Omit<User, "password">;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Settings = {
  darkMode: boolean;
  exposeName: boolean;
  showQuizTimer: boolean;
  profileImageId: string;
  profileImageColour: String;
};

// Response codes:
// 200 OK
// 201 Created
// 204 No Content
// 400 Bad Request
// 409 Conflict
// 500 Internal Server Error
// generic type for data, with default of null
export type ApiResponse<T = null> = {
  // TODO might not need success prop. can just use data prop for success calls?
  success: boolean;
  data?: T;
  statusCode: 200 | 201 | 204 | 400 | 401 | 409 | 500;
  message: string;
};
