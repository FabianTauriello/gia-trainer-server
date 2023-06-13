import mysql, { ResultSetHeader } from "mysql2";
import { ApiResponse, QuizAttempt } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

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
