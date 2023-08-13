import { ApiResponse, SanitizedUser, User, UserDataRow } from "../domain/Types";
import { Utils } from "../utils/Utils";
import { connectionPool } from "./DatabaseConnection";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";

export namespace Auth {
  // return success if authorised
  export async function authenticateUser(
    credentials: unknown
  ): Promise<ApiResponse<{ user: SanitizedUser; token: string }>> {
    try {
      // verify email and password were passed in correctly first
      if (!Utils.isLoginCredentials(credentials)) {
        return {
          success: false,
          statusCode: 400,
          message: "Failed to sign in: credentials not passed in correctly",
        };
      }
      // check if user exists and password is valid
      const usersFound = await selectUser("email", credentials.email);
      if (!usersFound.success) throw "unable to retrieve user"; // TODO throw nothing
      if (usersFound.data?.length) {
        const user = usersFound.data[0];
        const match = await bcrypt.compare(credentials.password, user.password);
        if (match) {
          // valid user, generate JWT token
          const token = jwt.sign({ email: credentials.email }, process.env.JWT_SECRET_KEY!, { expiresIn: "60d" }); // TODO test expiration time
          // remove email and password before returning user
          const { password, ...userWithoutPassword } = user;
          return {
            success: true,
            data: {
              user: userWithoutPassword,
              token: token,
            },
            statusCode: 200,
            message: "",
          };
        } else {
          return {
            success: false,
            statusCode: 401,
            message: "Failed to sign in: password is incorrect",
          };
        }
      } else {
        return {
          success: false,
          statusCode: 401,
          message: "Failed to sign in: unable to find user",
        };
      }
    } catch (error) {
      console.error(`ERROR! ${error}`); // TODO .log or .error ?
      return {
        success: false,
        statusCode: 500,
        message: `Failed to sign in. ${error}`,
      };
    }
  }

  export async function createUser(newUser: unknown): Promise<ApiResponse<string>> {
    try {
      // verify user object is valid
      if (!Utils.isNewUser(newUser)) {
        return {
          success: false,
          statusCode: 400,
          message: "Failed to sign up: user object not passed in correctly",
        };
      }
      // check if user exists before inserting a new one
      const usersFound = await selectUser("email", newUser.email);
      if (!usersFound.success) throw "unable to verify if user already exists";
      if (usersFound.data?.length) {
        return {
          success: false,
          statusCode: 409,
          message: "Failed to sign up: email already in use",
        };
      }
      // hash password and insert new user. OWASP reccomends at least 10 for rounds - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const sql = "INSERT INTO user (email, password, firstName, lastName) VALUES (?, ?, ?, ?)";
      const [result] = await connectionPool.query<ResultSetHeader>(sql, [
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
        statusCode: 500,
        message: `Failed to sign up. ${error}`,
      };
    }
  }

  // uses parameterized queries (?) to defend against sql injection
  // returns success if query executed successfully, but beware, result array might be empty
  // data will be set to an array of users that meet the condition
  export async function selectUser(key: string, value: string): Promise<ApiResponse<User[]>> {
    try {
      const sql = `SELECT * FROM user WHERE ${key} = ?`;
      const [result] = await connectionPool.query<UserDataRow[]>(sql, [value]);
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
        statusCode: 500,
        message: "Failed to retrieve users. ${error}",
      };
    }
  }
}
