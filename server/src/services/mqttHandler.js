const mqtt = require("mqtt");
const pool = require("../config/database");
const parseTopic = require("../utils/parseTopic");

module.exports = (io) => {

  const client = mqtt.connect(
    process.env.MQTT_URL,
    {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    }
  );

  client.on("connect", () => {

    console.log("MQTT connected");

    client.subscribe(
      process.env.MQTT_TOPIC
    );
  });

  client.on("message", async (topic, message) => {

    const payload = message.toString();
    const topicInfo = parseTopic(topic);

    console.log("Received:", payload);

    try {

      // parse payload
      let parsed;

      try {

        parsed = JSON.parse(payload);

      } catch {

        const fixed =
          payload.replace(
            /([A-Z0-9\-]+):/g,
            '"$1":'
          );

        parsed = JSON.parse(fixed);
      }

      // dynamically find ASN field
      const asnKey =
        Object.keys(parsed).find(
          key => key.startsWith("ASN_")
        );

      if (!asnKey) {

        console.log("No ASN key found");

        return;
      }

      const [deviceRows] =
        await pool.execute(
          `SELECT * FROM devices
     WHERE imei = ?`,
          [topicInfo.imei]
        );

      if (deviceRows.length === 0) {

        console.log("Data received for unregistered device:");

        return;
      }

      // serial number
      const serial =
        parsed[asnKey];




  await pool.execute(
        `INSERT INTO messages
  (
    imei,
    app_version,
    solution,
    message_type,
    direction,
    topic,
    payload
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          topicInfo.imei,
          topicInfo.appVersion,
          topicInfo.solution,
          topicInfo.messageType,
          topicInfo.direction,
          topic,
          JSON.stringify(parsed),
        ]
      );

      // LIVE SOCKET UPDATE
      io.to(topicInfo.imei.toString())
        .emit("inverterData", parsed);

      console.log(
        `Live emitted to ${topicInfo.imei}`
      );


      io.on(
  "connection",
  (socket) => {

    socket.on(
      "joinDevice",
      (imei) => {

        socket.join(
          imei.toString()
        );

        console.log(
          "Joined room:",
          imei
        );

      }
    );

  }
);

    } catch (err) {

      console.error(
        "Error:",
        err.message
      );
    }
  });
};