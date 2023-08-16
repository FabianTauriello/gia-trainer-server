import { ResultSetHeader } from "mysql2";
import { ApiResponse, QuizAttempt } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

export namespace QuizHandler {
  // TODO change to user multiple queries at the same time (instead of sequentially adding an attempt, and THEN answers)
  // Returns the id of the new quiz attempt
  export async function addAttempt(userId: string, attempt: QuizAttempt): Promise<ApiResponse<string>> {
    try {
      const query = "INSERT INTO quizAttempt (userId, totalScore) VALUES (?, ?)";
      const [result] = await connectionPool.query<ResultSetHeader>(query, [userId, attempt.totalScore]);

      if (result.affectedRows === 0) throw "Failed to update any rows.";

      const newQuizAttemptId = result.insertId.toString();
      const res = await addAnswers(newQuizAttemptId, attempt);
      if (res.success) {
        return {
          success: true,
          data: newQuizAttemptId,
          statusCode: 201,
          message: "Successfully added new attempt",
        };
      } else {
        return res;
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: `Failed to add quiz attempt. ${error}`,
      };
    }
  }

  export async function addAnswers(quizAttemptId: string, attempt: QuizAttempt): Promise<ApiResponse<string>> {
    const rows = attempt.questions.map(item => [quizAttemptId, JSON.stringify(item)]);

    const query = "INSERT INTO answer (quizAttemptId, question) VALUES ?";
    const [result] = await connectionPool.query<ResultSetHeader>(query, [rows]);

    if (result.affectedRows > 0) {
      return {
        success: true,
        statusCode: 500,
        message: ``,
      };
    } else {
      return {
        success: false,
        statusCode: 500,
        message: `Failed to add quiz attempt answers.`,
      };
    }
  }
}
