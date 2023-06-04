import express from "express";
import questionData from "../data/questions.json";
import { ApiResponse, Question } from "./domain/Types";
import { Auth } from "./services/Auth";
import { Utils } from "./utils/Utils";

const app = express();
app.use(express.json());
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

// update endpoint to return type ApiResponse instead
app.get("/quizQuestions", (req, res) => {
  // const questions: Question[] = questionData.map((q, i) => ({ number: i + 1, ...q }));
  // res.json(questions);

  // TODO kinda ugly
  const numberedQuestions: Question[] = questionData.map((q, i) => ({ ...q, number: i }));
  const sortedQuestions = Utils.sortQuestionsByCategory(numberedQuestions);
  const finalQuestions = sortedQuestions.map((q, i) => ({ ...q, number: i + 1 }));

  res.json(finalQuestions);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/signIn", async (req, res) => {
  const credentials = req.body;
  const authResponse = await Auth.authenticateUser(credentials);
  res.status(authResponse.statusCode).send(authResponse);
});

app.post("/signUp", async (req, res) => {
  const newUser = req.body;
  const createUserResponse = await Auth.createUser(newUser);
  res.status(createUserResponse.statusCode).send(createUserResponse);
});
