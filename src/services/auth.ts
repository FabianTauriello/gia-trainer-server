import bcrypt from "bcrypt";
import mysql from "mysql2";
import { User } from "../domain/Types";
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
  export async function createUser(newUser: User) {
    try {
      const query = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
      const [result] = await connectionPool.query(query, [
        newUser.email,
        newUser.password,
        newUser.firstName,
        newUser.lastName,
      ]);

      console.log("result to sign-up: ", result);
    } catch (error) {
      console.log("error", error);
    }
  }
}
