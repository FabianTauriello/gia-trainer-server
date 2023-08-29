import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Connection } from "mysql2/promise";
import { ApiResponse, Settings, User } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

export namespace UserManagement {
  export async function updateUser(userId: number, newProfile: User): Promise<ApiResponse> {
    try {
      const sql = "UPDATE user SET firstName = ?, lastName = ?, profileImgId = ?, profileImgColor = ? WHERE id = ?";
      const [result] = await connectionPool.query<ResultSetHeader>(sql, [
        newProfile.firstName,
        newProfile.lastName,
        newProfile.profileImgId,
        newProfile.profileImgColor,
        userId,
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
      const sql = "SELECT * FROM settings WHERE userId = ?";
      const [rows] = await connectionPool.query<RowDataPacket[]>(sql, [userId]);

      if (rows.length === 0) throw "Failed to retrieve any rows.";

      const userSettings = { ...rows[0] };
      delete userSettings.id;
      delete userSettings.userId;
      userSettings.darkMode = userSettings.darkMode === 0 ? false : true;
      userSettings.exposeName = userSettings.exposeName === 0 ? false : true;
      userSettings.showQuizTimer = userSettings.showQuizTimer === 0 ? false : true;

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

  export async function updateUserSettings2(userId: number, newSettings: Settings): Promise<ApiResponse> {
    try {
      return {
        success: true,
        statusCode: 200,
        message: "Successfully updated user's settings",
      };
    } catch (error) {
      console.error(`ERROR! ${error}`);
      return {
        success: false,
        statusCode: 500,
        message: `Failed to update user's settings. ${error}`,
      };
    }
  }

  export async function updateUserSettings(userId: number, newSettings: Settings): Promise<ApiResponse> {
    try {
      const sql = "SELECT * FROM settings WHERE userId = ?";
      const [rows] = await connectionPool.query<RowDataPacket[]>(sql, userId);

      if (rows.length === 0) {
        // Insert a new record
        const sql = "INSERT INTO settings (userId, darkMode, exposeName, showQuizTimer) VALUES(?, ?, ?, ?)";
        const [result] = await connectionPool.query<ResultSetHeader>(sql, [
          userId,
          newSettings.darkMode,
          newSettings.exposeName,
          newSettings.showQuizTimer,
        ]);

        if (result.affectedRows === 0) throw "Failed to update any rows.";
      } else {
        // Update existing record
        const sql = "UPDATE settings SET darkMode = ?, exposeName = ?, showQuizTimer = ? WHERE userId = ?";
        const [result] = await connectionPool.query<ResultSetHeader>(sql, [
          newSettings.darkMode,
          newSettings.exposeName,
          newSettings.showQuizTimer,
          userId,
        ]);

        if (result.affectedRows === 0) throw "Failed to update any rows.";
      }

      return {
        success: true,
        statusCode: 200,
        message: "Successfully updated user's settings",
      };
    } catch (error) {
      console.error(`ERROR! ${error}`);
      return {
        success: false,
        statusCode: 500,
        message: `Failed to update user's settings. ${error}`,
      };
    }
  }
}
