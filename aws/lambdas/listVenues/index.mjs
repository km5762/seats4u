import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

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
  try {
    const [venues] = await connection.execute("SELECT * FROM venue");

    return {
      statusCode: 200,
      body: JSON.stringify(venues),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
