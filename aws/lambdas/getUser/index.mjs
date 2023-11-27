import jwt from "jsonwebtoken";
import fs from 'fs';

const jwtSecret = fs.readFileSync('private.key')

export const handler = async (event) => {
  const cookie = event.headers.cookie;

  if (!cookie) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Cookie missing" }),
    };
  }

  const token = cookie.split("=")[1];

  try {
    jwt.verify(token, jwtSecret)
  }
};
