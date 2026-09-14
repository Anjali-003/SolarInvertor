require("dotenv").config();
const path = require('path');
const express = require("express");
const cors = require("cors");

// TO BE REMOVED 
// const http = require("http");
// const { Server } = require("socket.io");
// const jwt = require("jsonwebtoken");

const pool = require("./src/config/database");
const messageRoutes = require("./src/routes/messageRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");
const adminDeviceRoutes = require("./src/routes/adminDeviceRoutes");
const adminAuthRoutes = require("./src/routes/adminAuthRoutes");
const energyRoutes = require("./src/routes/energyRoutes");
const userDeviceRoutes = require("./src/routes/userDeviceRoutes");

const reportRoutes =
    require(
        "./src/routes/reportRoutes"
    );

const app = express();
//const server = http.createServer(app);

// ─────────────────────────────────────
// SOCKET.IO
// ─────────────────────────────────────
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// ─────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────
app.use(cors());

app.use(express.json());

// ─────────────────────────────────────
// ROUTES
// ─────────────────────────────────────
app.use("/api", messageRoutes);

app.use("/api/certs",certificateRoutes);

app.use("/api/admin",adminAuthRoutes);
app.use("/api/admin",adminDeviceRoutes);

app.use(
    "/api/reports",
    reportRoutes
);

app.use(
    "/api/energy",
    energyRoutes
);

app.use(
    "/api/user",
    userDeviceRoutes
);

// ─────────────────────────────────────
// SOCKET AUTH MIDDLEWARE
// ─────────────────────────────────────

// io.use((socket, next) => {

//   try {

//     const token =
//       socket.handshake.auth.token;

//     if (!token) {

//       return next(
//         new Error("No token")
//       );
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // attach user to socket
//     socket.user = decoded;

//     next();

//   } catch (err) {

//     next(
//       new Error("Authentication error")
//     );
//   }
// });

// ─────────────────────────────────────
// SOCKET CONNECTION
// ─────────────────────────────────────


// io.on("connection", async (socket) => {

//   try {

//     console.log("✅ Socket Connected");

//     const imei =
//       socket.user.imei;

//     console.log(
//       `Client connected for inverter: ${imei}`
//     );

//     // join room
//     socket.join(imei.toString());

//     // fetch latest ONLY for this inverter
//     const [rows] = await pool.execute(
//       `
//       SELECT payload
//       FROM messages
//       WHERE imei = ?
//       ORDER BY created_at DESC
//       LIMIT 1
//       `,
//       [imei]
//     );

//     if (rows.length > 0) {

//       const latest = JSON.parse(
//         rows[0].payload
//       );

//       socket.emit(
//         "inverterData",
//         latest
//       );
//     }

//     socket.on("disconnect", () => {

//       console.log(
//         `❌ Client disconnected: ${imei}`
//       );
//     });

//   } catch (err) {

//     console.log(
//       "Socket connection error:",
//       err.message
//     );

//     socket.disconnect();
//   }
// });

// ─────────────────────────────────────
// MQTT HANDLER
// ─────────────────────────────────────
// require("./src/services/mqttHandler")(io);
require("./src/services/mqttHandler");


// ─────────────────────────────────────
// TEST ROUTE
// ─────────────────────────────────────
// app.get("/", (req, res) => {

//   res.send("Backend is running 🚀");
// });


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




app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});





// ─────────────────────────────────────
// START SERVER
// ─────────────────────────────────────
const PORT =
  process.env.PORT || 3001;

// server.listen(PORT, () => {
// app.listen(3000, "0.0.0.0")

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

// app.listen(3001, "0.0.0.0", () => {
//     console.log("Server running on port 3001");
// });