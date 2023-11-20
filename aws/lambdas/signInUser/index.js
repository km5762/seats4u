const jwt = require("jsonwebtoken");
const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

const hashedPassword =
  "$2y$12$2oGuO.M8ioZoaYhWt7tU9OqtebEUU.YSy/BxP1.P6g4p/Wbg4CSfC";
connection.query(
  "SELECT * FROM account WHERE hashed_password = CAST(? AS BINARY)",
  [hashedPassword],
  (error, results, fields) => {
    console.log(error);
    console.log(results);
  }
);

// exports.handler = async (event) => {
//   const { username, hashedPassword } = event;

//   connection.query(
//     `SELECT * FROM user WHERE hashed_password = '${hashedPassword}'`,
//     (error, results, fields) => {
//       console.log(results);
//     }
//   );
//   return response;
// };
