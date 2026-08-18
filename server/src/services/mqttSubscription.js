// const client = require("./mqttClient");

// const APP = process.env.MQTT_APP_VERSION;
// const SOLUTION = process.env.MQTT_SOLUTION;
// const DIRECTION = process.env.MQTT_DIRECTION;

// const SUBTOPICS =
//     process.env.MQTT_SUBTOPICS.split(",");

// function subscribeDevice(imei) {

//     SUBTOPICS.forEach(subTopic => {

//         const topic =
// `${APP}/${SOLUTION}/${imei}/${subTopic}/${DIRECTION}`;

//         client.subscribe(topic);

//         console.log("Subscribed:", topic);

//     });

// }

// module.exports = {
//     subscribeDevice
// };


const client = require("./mqttClient");

function subscribeDevice(imei, soluwtion, deviceVersion) {

   const topic = `${deviceVersion}/${solution}/${imei}/#`;

// const topic ="testt/#";
    client.subscribe(topic);

    console.log("Subscribed:", topic);
}

module.exports = {
    subscribeDevice
};