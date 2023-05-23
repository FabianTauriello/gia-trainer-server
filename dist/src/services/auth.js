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
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    // TODO how do i determine difference between success = false because exception thrown, and success = false because user already exists? - need to know for different status codes
    function createUser(newUser) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if user exists before inserting a new one
                const usersFound = yield selectUser("email", newUser.email);
                if (!usersFound.success)
                    throw "unable to verify if user already exists";
                if ((_a = usersFound.data) === null || _a === void 0 ? void 0 : _a.length) {
                    return {
                        success: false,
                        // data: "",
                        statusCode: 409,
                        message: "User already exists",
                    };
                }
                // hash password and insert new user. OWASP reccomends at least 10 for rounds - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
                const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
                const query = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
                const [result] = yield connectionPool.query(query, [
                    newUser.email,
                    hashedPassword,
                    newUser.firstName,
                    newUser.lastName,
                ]);
                if (result.affectedRows > 0) {
                    return {
                        success: true,
                        data: result.insertId.toString(),
                        statusCode: 201,
                        message: "Successfully created new user",
                    };
                }
                else {
                    throw "couldn't insert new user";
                }
            }
            catch (error) {
                console.error(`ERROR! ${error}`);
                return {
                    success: false,
                    // data: "",
                    statusCode: 500,
                    message: "Failed to create a new user: ${error}",
                };
            }
        });
    }
    Auth.createUser = createUser;
    // uses parameterized queries (?) to defend against sql injection
    // returns success if query executed successfully, but beware, result array might be empty
    function selectUser(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM user WHERE ${key} = ?`;
                const [result] = yield connectionPool.query(query, [value]);
                return {
                    success: true,
                    data: result,
                    statusCode: 200,
                    message: "",
                };
            }
            catch (error) {
                console.error(`ERROR! ${error}`); // TODO .log or .error ?
                return {
                    success: false,
                    // data: [],
                    statusCode: 500,
                    message: "Failed to retrieve users: ${error}",
                };
            }
        });
    }
    Auth.selectUser = selectUser;
    // return success if authorisec
    function authenticateUser(email, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersFound = yield selectUser("email", email);
                if (!usersFound.success)
                    throw "unable to retrieve user";
                if ((_a = usersFound.data) === null || _a === void 0 ? void 0 : _a.length) {
                    const match = yield bcrypt_1.default.compare(password, usersFound.data[0].password);
                    if (match) {
                        return {
                            success: true,
                            data: "JWT",
                            statusCode: 200,
                            message: "",
                        };
                    }
                    else {
                        return {
                            success: false,
                            statusCode: 401,
                            message: "Password is incorrect",
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        statusCode: 200,
                        message: "unable to find user",
                    };
                }
            }
            catch (error) {
                console.error(`ERROR! ${error}`); // TODO .log or .error ?
                return {
                    success: false,
                    // data: "",
                    statusCode: 500,
                    message: "Failed to authenticate user: ${error}",
                };
            }
        });
    }
    Auth.authenticateUser = authenticateUser;
})(Auth = exports.Auth || (exports.Auth = {}));
