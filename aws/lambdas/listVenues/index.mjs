import mysql from "mysql2/promise";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
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
  console.error("Database error: ", error);
}

export const handler = async (event) => {
  console.log(event);
  //   const cookie = event.headers.cookie;
  //   if (!cookie) {
  //     return {
  //       statusCode: 401,
  //       body: JSON.stringify({ error: "Cookie missing" }),
  //     };
  //   }
  //   const token = cookie.split("=")[1];
  //   let user
  //   try {
  //     {venueId} = jwt.verify(token, jwtSecret)
  //   }
};
