module.exports = function (topic) {
  const [
    appVersion = null,
    solution = null,
    imei = null,
    messageType = null,
    direction = null,
  ] = topic.split("/");

  return {
    appVersion,
    solution,
    imei,
    messageType,
    direction,
  };
};