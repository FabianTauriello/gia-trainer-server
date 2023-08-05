import "dotenv/config";
import express from "express";
import questionData from "../data/questions.json";
import fs from "fs";
import path from "path";
import https from "https";
import cors from "cors";
import { ApiResponse, Question } from "./domain/Types.js";
import { Auth } from "./services/Auth.js";
import { Utils } from "./utils/Utils.js";
import { Quiz } from "./services/Quiz.js";

const PORT_HTTP = 3001; // TODO set in .env file instead of here
const PORT_HTTPS = 3002; // TODO set in .env file instead of here

const app = express();
app.use(express.json());

// Setup server based on evironment
if (process.env.ENV === "dev") {
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "PUT", "POST", "DELETE"],
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    })
  );

  app.listen(PORT_HTTP, () => {
    console.log(`gia-trainer-server listening on port ${PORT_HTTP}`);
  });
} else {
  // Read the SSL/TLS certificate and private key
  const privateKey = fs.readFileSync(path.join(__dirname, process.env.SSL_FOLDER_PATH!, "private.key"), "utf8");
  const certificate = fs.readFileSync(path.join(__dirname, process.env.SSL_FOLDER_PATH!, "certificate.crt"), "utf8");
  const credentials = { key: privateKey, cert: certificate };

  // Create an HTTPS server using the credentials
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PORT_HTTPS, () => {
    console.log(`gia-trainer-server listening on port ${PORT_HTTPS}`);
  });
}

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
