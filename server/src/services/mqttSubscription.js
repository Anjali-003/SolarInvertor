const client = require("./mqttClient");

function subscribeDevice(imei, solution, deviceVersion) {

   const topic = `${deviceVersion}/${solution}/${imei}/#`;

// const topic ="testt/#";
    client.subscribe(topic);

    console.log("Subscribed:", topic);
}

module.exports = {
    subscribeDevice
};