// const pool = require("../config/database");

// exports.getMessages = async (req, res) => {
//   try {
//     const [rows] = await pool.execute(
//       "SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



const pool = require("../config/database");

exports.getLatestMessage = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT payload, created_at FROM messages ORDER BY created_at DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const rawPayload = rows[0].payload;

    let parsed;
    try {
      parsed = JSON.parse(rawPayload);
    } catch (err) {
      return res.status(500).json({ error: "Invalid JSON in payload" });
    }

    // attach timestamp
    parsed.TIMESTAMP = rows[0].created_at;

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};