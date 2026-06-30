const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
});

client.on("connect", () => {
    console.log("✅ MQTT Connected");
});

client.on("error", err => {
    console.log(err);
});

module.exports = client;