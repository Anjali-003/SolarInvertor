require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const pool = require("./src/config/database");
const vendorRoutes = require("./src/routes/vendorRoutes");
const authRoutes = require("./src/routes/authRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const userRoutes = require("./src/routes/userRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");
const vendorDeviceRoutes = require("./src/routes/vendorDeviceRoutes");

const app = express();
const server = http.createServer(app);

// ─────────────────────────────────────
// SOCKET.IO
// ─────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ─────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────
app.use(cors());

app.use(express.json());

// ─────────────────────────────────────
// ROUTES
// ─────────────────────────────────────
app.use("/api/auth", authRoutes);

app.use("/api", messageRoutes);

app.use("/api", userRoutes);

app.use("/api/certs",certificateRoutes);

app.use("/api/vendor",vendorRoutes);

// app.use(
//   "/api/devices",
//   require("./routes/vendorDeviceRoutes")
// );

app.use(
  "/api/devices",
  vendorDeviceRoutes
);

// ─────────────────────────────────────
// SOCKET AUTH MIDDLEWARE
// ─────────────────────────────────────
io.use((socket, next) => {

  try {

    const token =
      socket.handshake.auth.token;

    if (!token) {

      return next(
        new Error("No token")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // attach user to socket
    socket.user = decoded;

    next();

  } catch (err) {

    next(
      new Error("Authentication error")
    );
  }
});

// ─────────────────────────────────────
// SOCKET CONNECTION
// ─────────────────────────────────────
io.on("connection", async (socket) => {

  try {

    console.log("✅ Socket Connected");

    const imei =
      socket.user.imei;

    console.log(
      `Client connected for inverter: ${imei}`
    );

    // join room
    socket.join(imei.toString());

    // fetch latest ONLY for this inverter
    const [rows] = await pool.execute(
      `
      SELECT payload
      FROM messages
      WHERE imei = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [imei]
    );

    if (rows.length > 0) {

      const latest = JSON.parse(
        rows[0].payload
      );

      socket.emit(
        "inverterData",
        latest
      );
    }

    socket.on("disconnect", () => {

      console.log(
        `❌ Client disconnected: ${imei}`
      );
    });

  } catch (err) {

    console.log(
      "Socket connection error:",
      err.message
    );

    socket.disconnect();
  }
});

// ─────────────────────────────────────
// MQTT HANDLER
// ─────────────────────────────────────
require("./src/services/mqttHandler")(io);

// ─────────────────────────────────────
// TEST ROUTE
// ─────────────────────────────────────
app.get("/", (req, res) => {

  res.send("Backend is running 🚀");
});


// Add this BEFORE server.listen()

app.get("/test", (req, res) => {
  res.json({ 
    message: "Express is working",
    time: new Date().toISOString()
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API routes working",
    time: new Date().toISOString()
  });
});



// ─────────────────────────────────────
// START SERVER
// ─────────────────────────────────────
const PORT =
  process.env.PORT || 3000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});