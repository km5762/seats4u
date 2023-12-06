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
  const { blockIds } = JSON.parse(event.body);

  try {
    let query =
      "DELETE block FROM block JOIN event ON block.event_id = event.id JOIN venue ON venue.id = event.venue_id WHERE block.id = ?";

    if (user.roleId === Role.VENUE_MANAGER) {
      query += "  AND venue_id = ?";
    }

    for (const blockId of blockIds) {
      if (user.roleId === Role.VENUE_MANAGER) {
        await connection.execute(query, [blockId, user.venueId]);
      } else {
        await connection.execute(query, [blockId]);
      }
    }

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
