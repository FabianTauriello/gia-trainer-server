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
exports.Quiz = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "..", "..", "..", ".env"),
});
// TODO export this connection pool from different module and use everywhere??
const connectionPool = mysql2_1.default
    .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})
    .promise();
var Quiz;
(function (Quiz) {
    function addAttempt(attempt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO quizAttempt (userId, totalScore) VALUES (?, ?)`;
                const [result] = yield connectionPool.query(query, [attempt.userId, attempt.attempt.totalScore]);
                console.log("result: ", result);
                if (result.affectedRows > 0) {
                    return {
                        success: true,
                        data: "success!",
                        statusCode: 201,
                        message: "Successfully added new attempt",
                    };
                }
                else {
                    throw "couldn't insert new attempt";
                }
            }
            catch (error) {
                return {
                    success: false,
                    statusCode: 500,
                    message: `Failed to add quiz attempt. ${error}`,
                };
            }
        });
    }
    Quiz.addAttempt = addAttempt;
})(Quiz = exports.Quiz || (exports.Quiz = {}));
