const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all origins (default configuration)
app.use(cors()); // This will allow all origins by default

// OR: To allow specific origins, you can configure CORS like this:
const corsOptions = {
  origin: "http://localhost:19006", // Adjust this to match your React Native dev server
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: "127.0.0.1", // Use 127.0.0.1 (or localhost)
  port: 3306, // Default MySQL port
  user: "root", // Your MySQL username (root)
  password: "db2admin", // Your MySQL password
  database: "homework", // Your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Route to handle GET requests to the root URL "/"
app.get("/", (req, res) => {
  res.send("Hello, welcome to the API!"); // Response for the root endpoint
});

// SELECT FOR PROFILE
app.get("/data", (req, res) => {
  db.query(
    `SELECT 
              s.educationlevel, 
              s.degree, 
              s.currentschool, 
              s.yearlevel, 
              s.userid, 
              ut.firstname, 
              ut.lastname, 
              ut.birthdate, 
              ut.usertype,
              ua.bio,
              ua.accountid  -- Added accountid from user_account table
          FROM 
              student s
          INNER JOIN 
              user_table ut ON s.userid = ut.userid
          INNER JOIN 
              user_account ua ON s.userid = ua.userid
          WHERE 
              s.studentid = 1`,
    (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        res.status(500).send("Internal server error");
      } else if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send("No data found for student ID 1");
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
