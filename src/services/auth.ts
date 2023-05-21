import bcrypt from "bcrypt";
import mysql from "mysql2";
import { User } from "../domain/Types";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", ".env"),
});

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // host: "127.0.0.1",
  // user: "root",
  // password: "",
  // database: "gia_trainer",
});

export namespace Auth {
  export function createUser(user: User) {
    const query = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
    const res = connection.query(query, [user.email, user.password, user.firstName, user.lastName]);

    console.log("result to sign-up: ", res);
  }
}
