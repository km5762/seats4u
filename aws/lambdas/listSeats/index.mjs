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
    let seats;
    let blocks;
    switch (user.roleId) {
      case Role.VENUE_MANAGER:
        [seats] = await connection.execute(
          "SELECT seat.id, seat.section_id, seat.available, seat.section_row, seat.section_col FROM seat JOIN event ON seat.event_id = event.id WHERE (event.active OR event.venue_id = ?) AND event.id = ?",
          [user.venueId, eventId]
        );
        [blocks] = await connection.execute(
          "SELECT block.id, block.section_id, block.price, block.start_row, block.end_row FROM block JOIN event ON block.event_id = event.id WHERE block.event_id = ? AND (event.active OR venue_id = ?)",
          [eventId, user.venueId]
        );
        break;
      case Role.ADMIN:
        [seats] = await connection.execute(
          "SELECT seat.id, seat.section_id, seat.available, seat.section_row, seat.section_col FROM seat WHERE event_id = ?",
          [eventId]
        );
        [blocks] = await connection.execute(
          "SELECT block.id, block.section_id, block.price, block.start_row, block.end_row FROM block WHERE event_id = ?",
          [eventId]
        );
        break;
      default:
        [seats] = await connection.execute(
          "SELECT seat.id, seat.section_id, seat.available, seat.section_row, seat.section_col FROM seat JOIN event ON seat.event_id = event.id WHERE event.active AND event.id = ?",
          [eventId]
        );
        [blocks] = await connection.execute(
          "SELECT block.id, block.section_id, block.price, block.start_row, block.end_row FROM block JOIN event ON block.event_id = event.id WHERE block.event_id = ? AND event.active",
          [eventId]
        );
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ seats: seats, blocks: blocks }),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
