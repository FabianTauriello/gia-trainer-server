import mysql, { ResultSetHeader } from "mysql2";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", ".env"),
});

// TODO export this connection pool from different module and use everywhere??
export const connectionPool = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise(); // enables promise api version so I can use async/await instead of callbacks
