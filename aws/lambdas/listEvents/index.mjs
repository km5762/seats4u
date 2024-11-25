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
  let venueId;
  try {
    venueId = event.queryStringParameters.venueId;
  } catch (error) {}

  try {
    let query;
    let queryParams = [];
    switch (user.roleId) {
      case Role.ADMIN:
        query = "SELECT * FROM event";
        break;
      case Role.VENUE_MANAGER:
        query = "SELECT * FROM event WHERE active OR venue_id = ?";
        queryParams = [user.venueId];
        break;
      default:
        query = "SELECT * FROM event WHERE active";
        break;
    }

    if (venueId) {
      query += " AND venue_id = ?";
      queryParams.push(venueId);
    }

    const [events] = await connection.execute(query, queryParams);
    const [sections] = await connection.execute("SELECT * FROM section");

    return {
      statusCode: 200,
      body: JSON.stringify({ events: events, sections: sections }),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
