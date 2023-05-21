"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questions_json_1 = __importDefault(require("../data/questions.json"));
const Utils_1 = require("./utils/Utils");
const Auth_1 = require("./services/Auth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
    const numberedQuestions = questions_json_1.default.map((q, i) => (Object.assign(Object.assign({}, q), { number: i })));
    const sortedQuestions = (0, Utils_1.sortQuestionsByCategory)(numberedQuestions);
    const finalQuestions = sortedQuestions.map((q, i) => (Object.assign(Object.assign({}, q), { number: i + 1 })));
    res.json(finalQuestions);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
app.post("/signIn", (req, res) => { });
app.post("/signUp", (req, res) => {
    if ((0, Utils_1.isUser)(req.body)) {
        const newUser = req.body;
        Auth_1.Auth.createUser(newUser);
        res.sendStatus(201);
    }
    else {
        res.sendStatus(404);
    }
});
