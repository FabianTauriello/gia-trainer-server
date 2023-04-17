"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questions_json_1 = __importDefault(require("../data/questions.json"));
const app = (0, express_1.default)();
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
    const questions = questions_json_1.default.map((q, i) => (Object.assign({ number: i + 1 }, q)));
    res.json(questions);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
