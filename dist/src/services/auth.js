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
exports.Auth = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "..", "..", "..", ".env"),
});
const connectionPool = mysql2_1.default
    .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})
    .promise(); // enables promise api version so I can use async/await instead of callbacks
var Auth;
(function (Auth) {
    function createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
                const [result] = yield connectionPool.query(query, [
                    newUser.email,
                    newUser.password,
                    newUser.firstName,
                    newUser.lastName,
                ]);
                console.log("result to sign-up: ", result);
            }
            catch (error) {
                console.log("error", error);
            }
        });
    }
    Auth.createUser = createUser;
})(Auth = exports.Auth || (exports.Auth = {}));
