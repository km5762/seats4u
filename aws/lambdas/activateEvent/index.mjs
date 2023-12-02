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
  const { eventId } = JSON.parse(event.body);

  if (!eventId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing eventId" }),
    };
  }

  if (user.roleId === Role.VENUE_MANAGER) {
    const [rows] = await connection.execute(
      "SELECT venue_id FROM event WHERE id = ?",
      [eventId]
    );

    if (rows.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No event matches given eventId",
        }),
      };
    } else if (rows[0]["venue_id"] !== user.venueId) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "User does not own event venue",
        }),
      };
    }
  }

  try {
    await connection.execute("UPDATE event SET active = TRUE WHERE id = ?", [
      eventId,
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
};
