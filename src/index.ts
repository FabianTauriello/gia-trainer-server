import "dotenv/config";
import express from "express";
import questionData from "../data/questions.json";
import fs from "fs";
import https from "https";
import cors, { CorsOptions } from "cors";
import { ApiResponse, Question } from "./domain/Types.js";
import { Auth } from "./services/Auth.js";
import { Utils } from "./utils/Utils.js";
import { QuizHandler } from "./services/QuizHandler.js";

const PORT = 3001;

const app = express();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", "https://gia-trainer.vercel.app"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.options(["*"], cors(corsOptions)); // allows OPTIONS/preflight requests from any origin, for all routes

// Setup http/https server based on evironment
if (process.env.ENV === "dev") {
  app.listen(PORT, () => console.log(`gia-trainer-server listening on port ${PORT} with HTTP`));
} else {
  // Read the SSL/TLS certificate and private key
  const privateKey = fs.readFileSync("/etc/letsencrypt/live/gia-trainer.com/privkey.pem");
  const certificate = fs.readFileSync("/etc/letsencrypt/live/gia-trainer.com/fullchain.pem");
  const options = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(options, app);

  httpsServer.listen(PORT, () => console.log(`gia-trainer-server listening on port ${PORT} with HTTPS`));
}

app.get("/", (req, res) => {
  console.log("saying hello");

  res.send("Hello World!!");
});

app.post("/signIn", async (req, res) => {
  console.log("signing in");

  const credentials = req.body;
  const response = await Auth.authenticateUser(credentials);
  res.status(response.statusCode).send(response);
});

app.post("/signUp", async (req, res) => {
  console.log("signing up");

  const newUser = req.body;
  const response = await Auth.createUser(newUser);
  res.status(response.statusCode).send(response);
});

app.get("/quizQuestions", (req, res) => {
  console.log("getting quiz questions");

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
  console.log("adding quiz attempt");

  const { userId, attempt } = req.body;
  const response = await QuizHandler.addAttempt(userId, attempt);
  res.status(response.statusCode).send(response);
});
