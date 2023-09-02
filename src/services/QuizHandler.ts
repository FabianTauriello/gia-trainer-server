import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ApiResponse, Question, QuizAttempt } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

// TODO use this or just use type from types.ts??
interface QuizAttemptRecord extends RowDataPacket {
  id: number;
  userId: number;
  totalScore: number;
  timestamp: string;
}

// TODO use this or just use type from types.ts??
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
      const sql = "INSERT INTO quizAttempt (userId, totalScore) VALUES (?, ?)";
      const [result] = await connectionPool.query<ResultSetHeader>(sql, [userId, attempt.totalScore]);

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

    const sql = "INSERT INTO question (quizAttemptId, data) VALUES ?";
    const [result] = await connectionPool.query<ResultSetHeader>(sql, [rows]);

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
      const sql = "SELECT * FROM quizAttempt WHERE userId = ?";
      const [rows] = await connectionPool.query<QuizAttemptRecord[]>(sql, userId);
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

  export async function getAllQuizAttempts(
    userId: number,
    page: number,
    limit: number
  ): Promise<
    ApiResponse<{
      attempts: QuizAttempt[];
      totalPages: number;
    }>
  > {
    try {
      const offset = (page - 1) * limit;

      // Get paginated attempts for a user
      const paginationSql = "SELECT * FROM quizAttempt WHERE userId = ? LIMIT ?, ?";
      const [quizAttemptsRecords] = await connectionPool.query<QuizAttemptRecord[]>(paginationSql, [
        userId,
        offset,
        limit,
      ]);

      // Get total attempts count for a user
      const countSql = "SELECT COUNT(*) AS count FROM quizAttempt WHERE userId = ?";
      const [allAttempts] = await connectionPool.query<RowDataPacket[]>(countSql, [userId]);

      const attempts: QuizAttempt[] = [];
      for (let rec of quizAttemptsRecords) {
        const questions = await getQuestionsForQuizAttempt(rec.id);
        attempts.push({
          id: rec.id,
          questions: questions,
          totalScore: rec.totalScore,
          timestamp: rec.timestamp,
        });
      }

      return {
        success: true,
        data: {
          attempts: attempts,
          totalPages: Math.ceil(allAttempts[0].count / limit),
        },
        statusCode: 200,
        message: "Successfully retrieved all of a user's quiz attempts",
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: `Failed to get all quiz attempts. ${error}`,
      };
    }
  }

  async function getQuestionsForQuizAttempt(quizId: number): Promise<Question[]> {
    const sql = "SELECT * FROM question WHERE quizAttemptId = ?";
    const [rows] = await connectionPool.query<QuestionRecord[]>(sql, quizId);
    if (rows.length === 0) throw "Failed to get questions.";
    const result = rows.map(row => row.data);
    return result;
  }
}
