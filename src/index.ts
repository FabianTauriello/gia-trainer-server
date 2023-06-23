import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import questionData from "../data/questions.json";
import fs from "fs";
import path from "path";
import https from "https";
import cors from "cors";
import morgan from "morgan";
import { ApiResponse, Question } from "./domain/Types.js";
import { Auth } from "./services/Auth.js";
import { Utils } from "./utils/Utils.js";
import { Quiz } from "./services/Quiz.js";

const app = express();

// Configure morgan as middleware for logging
app.use(morgan("combined"));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use(express.json());
// TODO change this behaviour later. This is not recommended for production environments, as it may pose
// security risks. It's better to restrict the origins that can access your API by specifying them explicitly.
// app.use((_req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://localhost:5173/");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });
app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
  })
);

const httpPort = 3001;
const httpsPort = 3002;

// Read the SSL/TLS certificate and private key
const privateKey = fs.readFileSync(path.join(__dirname, process.env.SSL_FOLDER_PATH!, "private.key"), "utf8");
const certificate = fs.readFileSync(path.join(__dirname, process.env.SSL_FOLDER_PATH!, "certificate.crt"), "utf8");
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server using the credentials
const httpsServer = https.createServer(credentials, app);

app.listen(httpPort, () => {
  console.log(`HTTP gia-trainer-server listening on port ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS gia-trainer-server listening on port ${httpsPort}`);
});

// app.get("/.well-known/pki-validation/5AC11FE6F957A94D5B49AF1925882B3B.txt", (req, res) => {
//   const filePath = "assets/5AC11FE6F957A94D5B49AF1925882B3B.txt";
//   const fileContent = fs.readFileSync(filePath, "utf8");

//   res.setHeader("Content-Type", "text/plain");

//   res.send(fileContent);
// });

app.get("/", (req, res) => {
  res.send("Hello World!!");
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
  // TODO kinda ugly and missing trycatch
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
