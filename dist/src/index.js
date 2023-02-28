"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questions_json_1 = __importDefault(require("../data/questions.json"));
const app = (0, express_1.default)();
const port = 3001;
app.get("/", (req, res) => {
    res.send("Hello World!!");
});
app.get("/getQuestions", (req, res) => {
    res.json(questions_json_1.default);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
