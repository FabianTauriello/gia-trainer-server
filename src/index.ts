import express from "express";
import questionData from "../data/questions.json";
import { Question } from "./domain/types";
import { sortQuestionsBySection } from "./utils/Utils";

const app = express();
const port = 3001;

// TODO change this behaviour later. This is not recommended for production environments, as it may pose
// security risks. It's better to restrict the origins that can access your API by specifying them explicitly.
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/quizQuestions", (req, res) => {
  // const questions: Question[] = questionData.map((q, i) => ({ number: i + 1, ...q }));
  // res.json(questions);

  // TODO kinda ugly
  const numberedQuestions: Question[] = questionData.map((q, i) => ({ ...q, number: i }));
  const sortedQuestions = sortQuestionsBySection(numberedQuestions);
  const finalQuestions = sortedQuestions.map((q, i) => ({ ...q, number: i + 1 }));

  res.json(finalQuestions);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
