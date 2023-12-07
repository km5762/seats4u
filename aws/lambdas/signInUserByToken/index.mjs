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
  let user = event.requestContext.authorizer.lambda;

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Token missing" }),
    };
  }

  let rows;
  try {
    [rows] = await connection.execute("SELECT * FROM user WHERE id = ?", [
      user.sub,
    ]);
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }

  if (rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "User not found" }),
    };
  }

  user = rows[0];

  let responseBody;
  if (user["role_id"] === Role.ADMIN) {
    try {
      const [venues] = await connection.execute("SELECT * FROM venue");
      responseBody = { user: user, venues: venues };
    } catch (error) {
      console.error("Database error: ", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  } else if (user["role_id"] === Role.VENUE_MANAGER) {
    try {
      const [events] = await connection.execute(
        "SELECT * FROM event WHERE venue_id = ?",
        [user["venue_id"]]
      );
      const [venue] = await connection.execute(
        "SELECT * FROM venue WHERE id = ?",
        [user["venue_id"]]
      );
      responseBody = {
        user: user,
        venue: venue,
        events: events,
      };
    } catch (error) {
      console.error("Database error: ", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
};
