import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const Role = Object.freeze({ ADMIN: 1, VENUE_MANAGER: 2 });

let connection;
try {
  connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
} catch (error) {
  console.error("Database error: ", error);
}

export const handler = async (event) => {
  const user = event.requestContext.authorizer.lambda;
  const requestedVenueId = JSON.parse(event.body).venueId;

  if (!requestedVenueId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "venueId missing" }),
    };
  }

  if (
    (user.roleId === Role.VENUE_MANAGER && user.venueId === requestedVenueId) ||
    user.roleId === Role.ADMIN
  ) {
    try {
      await connection.execute("DELETE FROM venue WHERE id = ?", [
        requestedVenueId,
      ]);

      return {
        statusCode: 200,
      };
    } catch (error) {
      console.error("Database error: ", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  } else {
    return {
      statusCode: 403,
    };
  }
};
