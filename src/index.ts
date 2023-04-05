import express from "express";
import sectionData from "../data/sections.json";
import testData from "../data/testData.json";

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

app.get("/quizSections", (req, res) => {
  console.log("calling /quizSections");
  res.json(sectionData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
