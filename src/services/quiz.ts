import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

console.log("connection: ", connection);

// add and update quiz results for a user
