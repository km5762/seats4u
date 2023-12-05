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
  const { blocks } = JSON.parse(event.body);

  const eventIds = [...new Set(blocks.map((block) => block.eventId))];
  const sectionIds = [...new Set(blocks.map((block) => block.sectionId))];

  try {
    if (user.roleId === Role.VENUE_MANAGER) {
      const [venueIds] = connection.execute(
        "SELECT venue_id FROM event WHERE id IN (?) UNION SELECT venue_id FROM section WHERE id IN (?)",
        [eventIds.join(", "), sectionIds.join(", ")]
      );

      if (!venueIds.every((venueId) => venueId === user.venueId)) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            error:
              "User does not own venue for which blocks are being inserted",
          }),
        };
      }
    }

    const blockValues = blocks.map((block) => [
      block.eventId,
      block.sectionId,
      block.price,
      block.startRow,
      block.endRow,
    ]);

    const res = await connection.execute(
      "INSERT INTO block (event_id, section_id, price, start_row, end_row) VALUES ?",
      [blockValues]
    );

    console.log(res);

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
