import express from "express";
import questionData from "../data/questions.json";
import fs from "fs";
import path from "path";
import { ApiResponse, Question } from "./domain/Types.js";
import { Auth } from "./services/Auth.js";
import { Utils } from "./utils/Utils.js";
import { Quiz } from "./services/Quiz.js";

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

app.listen(port, () => {
  console.log(`gia-trainer-server listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/.well-known/pki-validation/EBB39D234718665834EDC4C296ACFB79.txt", (req, res) => {
  const filePath = path.join(__dirname, "..", "..", "assets", "EBB39D234718665834EDC4C296ACFB79.txt");
  const fileContent = fs.readFileSync(filePath, "utf8");

  res.setHeader("Content-Type", "text/plain");

  res.send(fileContent);
});

app.post("/signIn", async (req, res) => {
  const credentials = req.body;
  const response = await Auth.authenticateUser(credentials);
  res.status(response.statusCode).send(response);
});

app.post("/signUp", async (req, res) => {
  const newUser = req.body;
  const response = await Auth.createUser(newUser);
  res.status(response.statusCode).send(response);
});

app.get("/quizQuestions", (req, res) => {
  // TODO kinda ugly
  const numberedQuestions: Question[] = questionData.map((q: any, i: any) => ({ ...q, number: i }));
  const sortedQuestions = Utils.sortQuestionsByCategory(numberedQuestions);
  const finalQuestions = sortedQuestions.map((q, i) => ({ ...q, number: i + 1 }));
  const response: ApiResponse<Question[]> = {
    success: true,
    data: finalQuestions,
    statusCode: 200,
    message: "",
  };

  res.status(response.statusCode).send(response);
});

app.post("/addQuizAttempt", async (req, res) => {
  const { userId, attempt } = req.body;
  const response = await Quiz.addAttempt(userId, attempt);
  res.status(response.statusCode).send(response);
});
