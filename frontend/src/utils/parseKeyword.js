

export function parseKeyword(keyword) {

  const parts = keyword.split("-");

  return {

    deviceType: parts[0] || null,

    deviceId: parts[1] || null,

    plantBlockId: parts[2] || null,

    dbId: parts[3] || null,

    inverterId: parts[4] || null,

    parameter: parts[parts.length - 1] || null,
  };
}