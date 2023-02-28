import express from "express";
import questionData from "../data/questions.json";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/getQuestions", (req, res) => {
  res.json(questionData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
