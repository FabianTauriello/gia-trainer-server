import mysql from "mysql2";

export const connectionPool = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // supportBigNumbers: true,
    // bigNumberStrings: true,
  })
  .promise(); // enables promise api version so I can use async/await instead of callbacks
