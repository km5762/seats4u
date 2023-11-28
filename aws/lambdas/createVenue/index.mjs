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

  if (!cookie) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Cookie missing" }),
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
    user.roleId === Role.VENUE_MANAGER ||
    user.roleId === Role.ADMIN
  ) {
    try {
      
      const [rows, fields] = await connection.execute("SELECT venue_id FROM user WHERE id = ? AND venue_id = NULL", [user.sub]);
      
      if (rows.length === 1) {

        const requestBody = JSON.parse(event.body);
          const newVenueName = requestBody.name;
          
          const [res] = await connection.execute("INSERT INTO venue (name) VALUES (?)", [newVenueName]);
          await connection.execute("Update user SET venue_id = ? WHERE id = ?", [res.insertId,user.sub]);
    
          return {
            statusCode: 200,
          };
      }
      else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "User already has a venue" }),
        };
      }
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
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }
};