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
  const { eventId } = JSON.parse(event.body);
  const user = event.requestContext.authorizer.lambda;

  try {
    let query;
    let queryParams = [];
    switch (user.roleId) {
      case Role.VENUE_MANAGER:
        query =
          "SELECT seat.id, seat.event_id, seat.section_id, seat.available, seat.section_row, seat.section_col, block.price FROM seat JOIN block ON seat.event_id = block.event_id AND seat.section_row BETWEEN block.start_row AND block.end_row JOIN event ON seat.event_id = event.id JOIN venue ON event.venue_id = venue.id WHERE seat.event_id = ? AND (event.active OR event.venue_id = ?)";
        queryParams = [eventId, user.venueId];
        break;
      case Role.ADMIN:
        query =
          "SELECT seat.id, seat.event_id, seat.section_id, seat.available, seat.section_row, seat.section_col, block.price FROM seat JOIN block ON seat.event_id = block.event_id AND seat.section_row BETWEEN block.start_row AND block.end_row JOIN event ON seat.event_id = event.id";
        queryParams = [eventId];
        break;
      default:
        query =
          "SELECT seat.id, seat.event_id, seat.section_id, seat.available, seat.section_row, seat.section_col, block.price FROM seat JOIN block ON seat.event_id = block.event_id AND seat.section_row BETWEEN block.start_row AND block.end_row JOIN event ON seat.event_id = event.id WHERE event.active";
        queryParams = [eventId];
        break;
    }

    const [seats] = await connection.execute(query, queryParams);

    return {
      statusCode: 200,
      body: JSON.stringify(seats),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
