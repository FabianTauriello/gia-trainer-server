import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ApiResponse, Settings, User } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

export namespace UserManagement {
  export async function updateUser(updatedUser: User): Promise<ApiResponse<string>> {
    try {
      const query = "UPDATE user SET firstName = ?, lastName = ? WHERE id = ?";
      const [result] = await connectionPool.query<ResultSetHeader>(query, [
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.id,
      ]);
      if (result.affectedRows === 0) throw "Failed to update any rows.";
      return {
        success: true,
        statusCode: 200,
        message: "Successfully updated user",
      };
    } catch (error) {
      console.error(`ERROR! ${error}`);
      return {
        success: false,
        statusCode: 500,
        message: `Failed to update user. ${error}`,
      };
    }
  }
  export async function getUserSettings(userId: number): Promise<ApiResponse<Settings>> {
    try {
      const query = "SELECT * FROM settings WHERE userId = ?";
      const [rows] = await connectionPool.query<RowDataPacket[]>(query, [userId]);
      if (rows.length === 0) throw "Failed to retrieve any rows.";
      const userSettings = { ...rows[0] };
      delete userSettings.id;
      delete userSettings.userId;
      return {
        success: true,
        data: userSettings as Settings,
        statusCode: 200,
        message: "Successfully retrieved user's settings",
      };
    } catch (error) {
      console.error(`ERROR! ${error}`);
      return {
        success: false,
        statusCode: 500,
        message: `Failed to get user's settings. ${error}`,
      };
    }
  }
}
