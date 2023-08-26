import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ApiResponse, Settings, User } from "../domain/Types";
import { connectionPool } from "./DatabaseConnection";

export namespace UserManagement {
  export async function updateUser(newProfile: User, userId: number): Promise<ApiResponse<string>> {
    try {
      const query = "UPDATE user SET firstName = ?, lastName = ?, profileImgId = ?, profileImgColor = ? WHERE id = ?";
      const [result] = await connectionPool.query<ResultSetHeader>(query, [
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
      const query = "SELECT * FROM settings WHERE userId = ?";
      const [rows] = await connectionPool.query<RowDataPacket[]>(query, [userId]);
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
}
