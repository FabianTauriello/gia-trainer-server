"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sections_json_1 = __importDefault(require("../data/sections.json"));
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
app.get("/quizSections", (req, res) => {
    console.log("calling /quizSections");
    res.json(sections_json_1.default);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});