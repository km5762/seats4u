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

  try {
    const venueIdConstraint =
      user.roleId === Role.VENUE_MANAGER ? "WHERE venue.id = ?" : "";
    let query = `SELECT e.event_id, e.event_name, e.available_seats, e.unavailable_seats, COALESCE(r.total_revenue, 0) AS total_revenue FROM ( SELECT event.id as event_id, event.name as event_name, venue.id as venue_id, COUNT(CASE WHEN seat.available = true THEN 1 END) as available_seats, COUNT(CASE WHEN seat.available = false THEN 1 END) as unavailable_seats FROM event LEFT JOIN seat ON seat.event_id = event.id LEFT JOIN venue ON venue.id = event.venue_id ${venueIdConstraint} GROUP BY event.id, event.name, venue.id ) e LEFT JOIN ( SELECT event.id AS event_id, SUM(block.price) AS total_revenue FROM event JOIN block ON event.id = block.event_id JOIN seat ON seat.event_id = block.event_id AND (seat.section_id = block.section_id OR block.section_id IS NULL) AND ((seat.section_row BETWEEN block.start_row AND block.end_row) OR block.section_id IS NULL) WHERE seat.available = false GROUP BY event.id ) r ON e.event_id = r.event_id`;

    let showsReport;
    if (user.roleId === Role.VENUE_MANAGER) {
      [showsReport] = await connection.execute(query, [user.venueId]);
    } else {
      [showsReport] = await connection.execute(query);
    }

    console.log(showsReport);

    return {
      statusCode: 200,
      body: JSON.stringify(showsReport),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
