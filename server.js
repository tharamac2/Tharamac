import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL Connection
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "brandxpress_app",
});

// ✅ Generate 4-digit OTP
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// 📌 API: Request OTP
app.post("/auth/request", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.json({ success: false, message: "Mobile required" });
  }

  const otp = generateOtp();

  // Store OTP temporarily
  await db.query(
    `REPLACE INTO otp_requests (mobile, otp) VALUES (?, ?)`,
    [mobile, otp]
  );

  console.log("OTP For Testing:", otp);

  return res.json({ success: true, message: "OTP sent" });
});

// 📌 API: Verify OTP
app.post("/auth/verify", async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.json({ success: false, message: "Mobile & OTP required" });
  }

  const [rows] = await db.query(
    `SELECT otp FROM otp_requests WHERE mobile = ? LIMIT 1`,
    [mobile]
  );

  if (!rows.length || rows[0].otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  // Check if user exists
  const [users] = await db.query(
    `SELECT * FROM users WHERE mobile = ?`,
    [mobile]
  );

  let user;
  if (users.length) {
    user = users[0]; // Existing user
  } else {
    // Auto create new user
    const [result] = await db.query(
      `INSERT INTO users (mobile, created_at) VALUES (?, NOW())`,
      [mobile]
    );

    user = { id: result.insertId, mobile };
  }

  return res.json({ success: true, user });
});

// Start Server
app.listen(5000, () =>
  console.log("✅ API running on http://localhost:5000")
);
