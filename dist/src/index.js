"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questions_json_1 = __importDefault(require("../data/questions.json"));
const Auth_1 = require("./services/Auth");
const Utils_1 = require("./utils/Utils");
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
    const sortedQuestions = Utils_1.Utils.sortQuestionsByCategory(numberedQuestions);
    const finalQuestions = sortedQuestions.map((q, i) => (Object.assign(Object.assign({}, q), { number: i + 1 })));
    res.json(finalQuestions);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
app.post("/signIn", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = req.body;
    console.log("cred:", credentials);
    if (Utils_1.Utils.hasSentCredentials(credentials)) {
        const authenticationResponse = yield Auth_1.Auth.authenticateUser(credentials.email, credentials.password);
        res.status(authenticationResponse.statusCode).send(authenticationResponse);
    }
    else {
        res.status(400).send({
            success: false,
            statusCode: 400,
            message: "Credentials not passed in correctly",
        });
    }
}));
app.post("/signUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = req.body;
    if (Utils_1.Utils.isUser(newUser)) {
        const createUserResponse = yield Auth_1.Auth.createUser(newUser);
        res.status(createUserResponse.statusCode).send(createUserResponse);
    }
    else {
        res.status(400).send({
            success: false,
            statusCode: 400,
            message: "User object not passed in correctly",
        });
    }
}));
