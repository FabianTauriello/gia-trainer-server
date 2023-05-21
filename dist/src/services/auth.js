"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "..", "..", "..", ".env"),
});
const connection = mysql2_1.default.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // host: "127.0.0.1",
    // user: "root",
    // password: "",
    // database: "gia_trainer",
});
var Auth;
(function (Auth) {
    function createUser(user) {
        const query = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
        const res = connection.query(query, [user.email, user.password, user.firstName, user.lastName]);
        console.log("result to sign-up: ", res);
    }
    Auth.createUser = createUser;
})(Auth = exports.Auth || (exports.Auth = {}));
