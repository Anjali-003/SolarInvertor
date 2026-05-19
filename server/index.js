// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Import MQTT handler (important: starts listener)
// require("./src/services/mqttHandler");

// const messageRoutes = require("./src/routes/messageRoutes");
// app.use("/api", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });





// Updated version with Socket.IO integration

// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// // 🔥 attach socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// app.use(cors());
// app.use(express.json());

// // make io available globally
// app.set("io", io);

// // import MQTT handler and pass io
// require("./services/mqttHandler")(io);

// const messageRoutes = require("./routes/messageRoutes");
// app.use("/api", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// server.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });



require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const pool = require("./src/config/database"); // 👈 ADD THIS
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const authRoutes = require("./src/routes/authRoutes");

// ✅ Create socket server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

// mount routes AFTER JSON and CORS middleware
app.use("/api/auth", authRoutes);

// ✅ 🔥 ADD THIS BLOCK HERE
// io.on("connection", async (socket) => {
//   console.log("Client connected");

//   try {
//     const [rows] = await pool.execute(
//       "SELECT payload FROM messages ORDER BY created_at DESC LIMIT 1"
//     );

//     if (rows.length > 0) {
//       socket.emit("inverterData", JSON.parse(rows[0].payload));
//     }
//   } catch (err) {
//     console.error("Error sending initial data:", err.message);
//   }
// });

io.on("connection", async (socket) => {
  console.log("AUTH:", socket.handshake.auth);


  try {

    // token from frontend
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("No token");
      return socket.disconnect();
    }

    // verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
        console.log(decoded);


    // user device serial
    const serial = decoded.serial_number;

    console.log(
      `Client connected for inverter: ${serial}`
    );

    // join room
    socket.join(serial.toString());

    // send latest data ONLY for this serial
    const [rows] = await pool.execute(
      `SELECT payload
       FROM messages
       WHERE serial_number = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [serial]
    );

    if (rows.length > 0) {

      const latest = JSON.parse(rows[0].payload);

      socket.emit("inverterData", latest);
    }

  } catch (err) {

    console.log("Socket auth error:", err.message);

    socket.disconnect();
  }
});

// 👇 MQTT handler (keep this AFTER io is created)
require("./src/services/mqttHandler")(io);

const messageRoutes = require("./src/routes/messageRoutes");
app.use("/api", messageRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});