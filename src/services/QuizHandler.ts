import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ApiResponse, Question, QuizAttempt } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

interface QuizAttemptRecord extends RowDataPacket {
  id: number;
  userId: number;
  totalScore: number;
  timestamp: string;
}

interface QuestionRecord extends RowDataPacket {
  id: number;
  quizAttemptId: number;
  data: Question;
}

export namespace QuizHandler {
  // TODO change to user multiple queries at the same time (instead of sequentially adding an attempt, and THEN questions)
  // Returns the id of the new quiz attempt
  export async function addAttempt(userId: number, attempt: QuizAttempt): Promise<ApiResponse<number>> {
    try {
      const query = "INSERT INTO quizAttempt (userId, totalScore) VALUES (?, ?)";
      const [result] = await connectionPool.query<ResultSetHeader>(query, [userId, attempt.totalScore]);

      if (result.affectedRows === 0) throw "Failed to update any rows.";

      const newQuizAttemptId = result.insertId;
      const res = await addQuestions(newQuizAttemptId, attempt);
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

  // TODO simplify need this? does it need to return its own apiresposne?? or can it just return a boolean?
  export async function addQuestions(quizAttemptId: number, attempt: QuizAttempt): Promise<ApiResponse<number>> {
    const rows = attempt.questions.map(item => [quizAttemptId, JSON.stringify(item)]);

    const query = "INSERT INTO question (quizAttemptId, data) VALUES ?";
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
        message: `Failed to add quiz attempt questions`,
      };
    }
  }

  export async function getQuizAttempts(userId: number): Promise<ApiResponse<QuizAttempt[]>> {
    try {
      const query = "SELECT * FROM quizAttempt WHERE userId = ?";
      const [rows] = await connectionPool.query<QuizAttemptRecord[]>(query, userId);
      if (rows.length === 0) throw "Failed to retrieve any rows.";
      const attempts: QuizAttempt[] = [];
      for (let row of rows) {
        const questions = await getQuestionsForQuizAttempt(row.id);
        attempts.push({
          id: row.id,
          questions: questions,
          totalScore: row.totalScore,
          timestamp: row.timestamp,
        });
      }
      return {
        success: true,
        data: attempts,
        statusCode: 200,
        message: "Successfully retrieved user's quiz attempts",
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: `Failed to get quiz attempts. ${error}`,
      };
    }
  }

  async function getQuestionsForQuizAttempt(quizId: number): Promise<Question[]> {
    const query = "SELECT * FROM question WHERE quizAttemptId = ?";
    const [rows] = await connectionPool.query<QuestionRecord[]>(query, quizId);
    if (rows.length === 0) throw "Failed to get questions.";
    const result = rows.map(row => row.data);
    return result;
  }
}
