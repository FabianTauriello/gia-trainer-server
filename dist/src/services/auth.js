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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const Utils_1 = require("../utils/Utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mysql2_1 = __importDefault(require("mysql2"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
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
    // return success if authorised
    function authenticateUser(credentials) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // verify email and password were passed in correctly first
                if (!Utils_1.Utils.isLoginCredentials(credentials)) {
                    return {
                        success: false,
                        statusCode: 400,
                        message: "Failed to sign in: credentials not passed in correctly",
                    };
                }
                // check if user exists and password is valid
                const usersFound = yield selectUser("email", credentials.email);
                if (!usersFound.success)
                    throw "unable to retrieve user"; // TODO throw nothing
                if ((_a = usersFound.data) === null || _a === void 0 ? void 0 : _a.length) {
                    const user = usersFound.data[0];
                    const match = yield bcrypt_1.default.compare(credentials.password, user.password);
                    if (match) {
                        // valid user, generate JWT token // TODO make sure different keys are being used for different environments (dev/staging/prod)
                        const token = jsonwebtoken_1.default.sign({ email: credentials.email }, process.env.JWT_SECRET_KEY, { expiresIn: "60d" }); // TODO test expiration time
                        // remove email and password before returning user
                        const { email, password } = user, userWithoutPassword = __rest(user, ["email", "password"]);
                        return {
                            success: true,
                            data: {
                                user: userWithoutPassword,
                                token: token,
                            },
                            statusCode: 200,
                            message: "",
                        };
                    }
                    else {
                        return {
                            success: false,
                            statusCode: 401,
                            message: "Failed to sign in: password is incorrect",
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        statusCode: 401,
                        message: "Failed to sign in: unable to find user",
                    };
                }
            }
            catch (error) {
                console.error(`ERROR! ${error}`); // TODO .log or .error ?
                return {
                    success: false,
                    statusCode: 500,
                    message: `Failed to sign in. ${error}`,
                };
            }
        });
    }
    Auth.authenticateUser = authenticateUser;
    function createUser(newUser) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // verify user object is valid
                if (!Utils_1.Utils.isNewUser(newUser)) {
                    return {
                        success: false,
                        statusCode: 400,
                        message: "Failed to sign up: user object not passed in correctly",
                    };
                }
                // check if user exists before inserting a new one
                const usersFound = yield selectUser("email", newUser.email);
                if (!usersFound.success)
                    throw "unable to verify if user already exists";
                if ((_a = usersFound.data) === null || _a === void 0 ? void 0 : _a.length) {
                    return {
                        success: false,
                        statusCode: 409,
                        message: "Failed to sign up: email already in use",
                    };
                }
                // hash password and insert new user. OWASP reccomends at least 10 for rounds - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
                const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
                const query = "INSERT INTO user (email, password, firstName, lastName) VALUES (?, ?, ?, ?)";
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
                    statusCode: 500,
                    message: `Failed to sign up. ${error}`,
                };
            }
        });
    }
    Auth.createUser = createUser;
    // uses parameterized queries (?) to defend against sql injection
    // returns success if query executed successfully, but beware, result array might be empty
    // data will be set to an array of users that meet the condition
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
                    statusCode: 500,
                    message: "Failed to retrieve users. ${error}",
                };
            }
        });
    }
    Auth.selectUser = selectUser;
})(Auth = exports.Auth || (exports.Auth = {}));
