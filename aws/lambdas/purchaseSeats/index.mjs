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
  const { seatIds } = JSON.parse(event.body);

  console.log(seatIds);
  try {
    const purchasedSeatIds = [];
    for (const seatId of seatIds) {
      const [res] = await connection.execute(
        "UPDATE seat JOIN event ON seat.event_id = event.id SET seat.available = FALSE WHERE seat.id = (?) AND event.active = TRUE AND seat.available = TRUE",
        [seatId]
      );

      if (res.affectedRows > 0) {
        purchasedSeatIds.push(seatId);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ purchasedSeatIds: purchasedSeatIds }),
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
