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
  const { venueId, name, date } = JSON.parse(event.body);

  if (
    (user.roleId === Role.VENUE_MANAGER && user.venueId === venueId) ||
    user.roleId === Role.ADMIN
  ) {
    try {
      await connection.query("START TRANSACTION");

      const [res] = await connection.execute(
        "INSERT INTO event (venue_id, name, date) VALUES (?, ?, ?)",
        [venueId, name, date]
      );

      const [sections] = await connection.execute(
        "SELECT id, row_count, col_count FROM section WHERE venue_id = ?",
        [venueId]
      );

      const seatValues = [];
      for (const section of sections) {
        for (let i = 0; i < section["row_count"]; i++) {
          for (let j = 0; j < section["col_count"]; j++) {
            seatValues.push([res.insertId, section["id"], i, j]);
          }
        }
      }

      const placeholder = seatValues.map(() => "(?, ?, ?, ?)").join(", ");
      const query = `INSERT INTO seat (event_id, section_id, section_row, section_col) VALUES ${placeholder}`;

      await connection.execute(query, seatValues.flat());

      await connection.query("COMMIT");
      return {
        statusCode: 200,
        body: JSON.stringify({ eventId: res.insertId }),
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
