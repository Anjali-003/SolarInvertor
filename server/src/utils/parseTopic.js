function parseTopic(topic) {

  const parts = topic.split("/");

  return {

    appVersion: parts[0] || null,

    solution: parts[1] || null,

    imei: parts[2] || null,

    messageType: parts[3] || null,

    direction: parts[4] || null,
  };
}

module.exports = parseTopic;