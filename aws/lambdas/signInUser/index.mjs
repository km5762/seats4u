import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

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
  console.error("Database error: " + error);
}

export const handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Username and password are required" }),
    };
  }

  let rows;
  try {
    [rows] = await connection.execute(
      "SELECT * FROM account WHERE username = ?",
      [username]
    );
  } catch (error) {
    console.error("Database error:", error);
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

  if (rows.length === 1) {
    const user = rows[0];
    const hash = user["hashed_password"].toString();

    try {
      const match = bcrypt.compareSync(password, hash);

      if (match === true) {
        const token = jwt.sign(
          {
            sub: user["id"],
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            username: user["username"],
            roleId: user["role_id"],
          },
          jwtSecret,
          { algorithm: "RS256" }
        );
        return {
          statusCode: 200,
          body: token,
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Incorrect password" }),
        };
      }
    } catch (error) {
      console.error("Bcrypt error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  } else {
    console.error("Database error: Two users exist with the same username");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
