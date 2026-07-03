const crypto = require("crypto");

// 32-byte key (256-bit)
const KEY = Buffer.from(process.env.AES_SECRET, "hex");

// 🔐 Encrypt function
function encrypt(text) {
  // 1. random IV (initialization vector)
  const iv = crypto.randomBytes(16);

  // 2. create cipher instance
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    KEY,
    iv
  );

  // 3. encrypt data
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // 4. authentication tag (ensures data not tampered)
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

// 🔓 Decrypt function
function decrypt(encryptedData, iv, authTag) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    KEY,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};