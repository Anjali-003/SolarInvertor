// const mqtt = require("mqtt");
// const pool = require("../config/database");

// const client = mqtt.connect(process.env.MQTT_URL, {
//   username: process.env.MQTT_USER,
//   password: process.env.MQTT_PASS,
// });

// // client.on("connect", () => {
// //   console.log("MQTT connected");
// //   client.subscribe(process.env.MQTT_TOPIC);
// // });

// client.on("connect", () => {
//   console.log("MQTT connected");
//   console.log("Subscribing to:", process.env.MQTT_TOPIC);

//   client.subscribe(process.env.MQTT_TOPIC, (err) => {
//     if (err) {
//       console.error("Subscribe error:", err);
//     } else {
//       console.log("Subscribed successfully");
//     }
//   });
// });


// client.on("message", async (topic, message) => {
//   const payload = message.toString();

//   console.log("Received:", topic, payload);

//   try {
//     await pool.execute(
//       "INSERT INTO messages (topic, payload) VALUES (?, ?)",
//       [topic, payload]
//     );
//   } catch (err) {
//     console.error("DB error:", err);
//   }
// });

// Updated version with Socket.IO integration

const mqtt = require("mqtt");
const pool = require("../config/database");

module.exports = (io) => {
  const client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
  });

  client.on("connect", () => {
    console.log("MQTT connected");
    client.subscribe(process.env.MQTT_TOPIC);
  });

  client.on("message", async (topic, message) => {
    const payload = message.toString();

    console.log("Received:", payload);

    try {
      // parse JSON safely
      let parsed;
      try {
        parsed = JSON.parse(payload);
      } catch {
        const fixed = payload.replace(/([A-Z0-9\-]+):/g, '"$1":');
        parsed = JSON.parse(fixed);
      }

      //  store in DB
      // await pool.execute(
      //   "INSERT INTO messages (topic, payload) VALUES (?, ?)",
      //   [topic, JSON.stringify(parsed)]
      // );
      await pool.execute(
        `INSERT INTO messages
  (serial_number, topic, payload)
  VALUES (?, ?, ?)`,
        [
          parsed.ASN_31,
          topic,
          JSON.stringify(parsed),
        ]
      );

      // ✅ FETCH LAST VALUE FROM DB (IMPORTANT)
      const [rows] = await pool.execute(
        "SELECT payload FROM messages ORDER BY created_at DESC LIMIT 1"
      );

      // // REAL-TIME EMIT
      // io.emit("inverterData", parsed);
      if (rows.length > 0) {
        const latest = JSON.parse(rows[0].payload);

        // ✅ Emit DB value instead of raw MQTT
        // io.emit("inverterData", latest);
        io.to(parsed.ASN_31.toString())
          .emit("inverterData", latest);
      }

    } catch (err) {
      console.error("Error:", err.message);
    }
  });
};