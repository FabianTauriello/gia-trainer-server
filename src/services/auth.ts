import bcrypt from "bcrypt";
import mysql, { ResultSetHeader } from "mysql2";
import { ApiResponse, User } from "../domain/Types";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", ".env"),
});

const connectionPool = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise(); // enables promise api version so I can use async/await instead of callbacks

export namespace Auth {
  // TODO how do i determine difference between success = false because exception thrown, and success = false because user already exists? - need to know for different status codes
  export async function createUser(newUser: User): Promise<ApiResponse<string>> {
    try {
      // check if user exists before inserting a new one
      const usersFound = await selectUser("email", newUser.email);
      if (!usersFound.success) throw "unable to verify if user already exists";
      if (usersFound.data?.length) {
        return {
          success: false,
          // data: "",
          statusCode: 409,
          message: "User already exists",
        };
      }

      // hash password and insert new user. OWASP reccomends at least 10 for rounds - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const query = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
      const [result] = await connectionPool.query<ResultSetHeader>(query, [
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
      } else {
        throw "couldn't insert new user";
      }
    } catch (error) {
      console.error(`ERROR! ${error}`);
      return {
        success: false,
        // data: "",
        statusCode: 500,
        message: "Failed to create a new user: ${error}",
      };
    }
  }

  // uses parameterized queries (?) to defend against sql injection
  // returns success if query executed successfully, but beware, result array might be empty
  export async function selectUser(key: string, value: string): Promise<ApiResponse<User[]>> {
    try {
      const query = `SELECT * FROM user WHERE ${key} = ?`;
      const [result] = await connectionPool.query<User[]>(query, [value]);
      return {
        success: true,
        data: result,
        statusCode: 200,
        message: "",
      };
    } catch (error) {
      console.error(`ERROR! ${error}`); // TODO .log or .error ?
      return {
        success: false,
        // data: [],
        statusCode: 500,
        message: "Failed to retrieve users: ${error}",
      };
    }
  }

  // return success if authorisec
  export async function authenticateUser(email: string, password: string): Promise<ApiResponse<string>> {
    try {
      const usersFound = await selectUser("email", email);
      if (!usersFound.success) throw "unable to retrieve user";
      if (usersFound.data?.length) {
        const match = await bcrypt.compare(password, usersFound.data[0].password);
        if (match) {
          return {
            success: true,
            data: "JWT", // TODO
            statusCode: 200,
            message: "",
          };
        } else {
          return {
            success: false,
            statusCode: 401,
            message: "Password is incorrect",
          };
        }
      } else {
        return {
          success: false,
          statusCode: 200,
          message: "unable to find user",
        };
      }
    } catch (error) {
      console.error(`ERROR! ${error}`); // TODO .log or .error ?
      return {
        success: false,
        // data: "",
        statusCode: 500,
        message: "Failed to authenticate user: ${error}",
      };
    }
  }
}
