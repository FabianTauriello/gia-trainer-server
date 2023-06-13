import mysql, { ResultSetHeader } from "mysql2";
import { ApiResponse, QuizAttempt } from "../domain/Types";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", ".env"),
});

// TODO export this connection pool from different module and use everywhere??
const connectionPool = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export namespace Quiz {
  export async function addAttempt(attempt: { userId: string; attempt: QuizAttempt }): Promise<ApiResponse<string>> {
    try {
      const query = `INSERT INTO quizAttempt (userId, totalScore) VALUES (?, ?)`;
      const [result] = await connectionPool.query<ResultSetHeader>(query, [attempt.userId, attempt.attempt.totalScore]);
      console.log("result: ", result);

      if (result.affectedRows > 0) {
        return {
          success: true,
          data: "success!",
          statusCode: 201,
          message: "Successfully added new attempt",
        };
      } else {
        throw "couldn't insert new attempt";
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: `Failed to add quiz attempt. ${error}`,
      };
    }
  }
}
