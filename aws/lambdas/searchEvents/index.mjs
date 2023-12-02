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
  const { searchQuery } = JSON.parse(event.body);

  if (!searchQuery) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing search query" }),
    };
  }

  try {
    const query =
      user.roleId === Role.ADMIN
        ? `SELECT venue.id AS venue_id, venue.name AS venue_name, event.id AS event_id, event.name AS event_name, event.date as event_date, event.active as event_active FROM venue, event WHERE venue.id = event.venue_id AND (event.name LIKE ? OR venue.name LIKE ?)`
        : `SELECT venue.id AS venue_id, venue.name AS venue_name, event.id AS event_id, event.name AS event_name, event.date as event_date FROM venue, event WHERE venue.id = event.venue_id AND event.active AND (event.name LIKE ? OR venue.name LIKE ?)`;

    const [events] = await connection.execute(query, [
      `${searchQuery.toLowerCase()}%`,
      `${searchQuery.toLowerCase()}%`,
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ events: events }),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
