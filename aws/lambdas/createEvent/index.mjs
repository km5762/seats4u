import mysql from "mysql2/promise";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";

dotenv.config();

const Role = Object.freeze({ ADMIN: 1, VENUE_MANAGER: 2 });

const jwtSecret = fs.readFileSync("private.key");

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
  const cookie = event.cookies[0];
  const { venueId, name, date } = JSON.parse(event.body);

  if (!cookie) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Cookie missing" }),
    };
  }

  if (!venueId || !name || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing venueId, name, or date" }),
    };
  }

  const token = cookie.split("=")[1];

  let user;
  try {
    user = jwt.verify(token, jwtSecret);
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  }

  if (
    (user.roleId === Role.VENUE_MANAGER && user.venueId === venueId) ||
    user.roleId === Role.ADMIN
  ) {
    try {
      const [res] = await connection.execute(
        "INSERT INTO event (venue_id, name, date) VALUES (?, ?, ?)",
        [venueId, name, date]
      );

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
