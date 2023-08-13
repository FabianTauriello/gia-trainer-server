import { ResultSetHeader } from "mysql2";
import { ApiResponse, User } from "../domain/Types";
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
      if (result.affectedRows === 0) throw "couldn't update user";
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
}
