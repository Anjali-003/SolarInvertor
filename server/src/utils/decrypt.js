// require("dotenv").config();
// const crypto = require("crypto");
// const readline = require("readline");

// const key = Buffer.from(process.env.AES_SECRET, "hex");

// if (key.length !== 32) {
//     console.error("Error: AES_KEY must be exactly 32 bytes (64 hex characters) for AES-256.");
//     process.exit(1);
// }


require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const crypto = require("crypto");
const readline = require("readline");

console.log("AES_KEY loaded:", !!process.env.AES_SECRET);

const key = Buffer.from(process.env.AES_SECRET || "", "hex");

if (key.length !== 32) {
    console.error(
        "Error: AES_KEY must be exactly 64 hexadecimal characters."
    );
    process.exit(1);
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function main() {
    try {
        const encrypted = await question("Enter encrypted data (hex): ");
        const iv = await question("Enter IV (hex): ");
        const authTag = await question("Enter auth tag (hex): ");

        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            key,
            Buffer.from(iv.trim(), "hex")
        );

        decipher.setAuthTag(
            Buffer.from(authTag.trim(), "hex")
        );

        let decrypted = decipher.update(
            encrypted.trim(),
            "hex",
            "utf8"
        );

        decrypted += decipher.final("utf8");

        console.log("\nDecrypted data:");
        console.log(decrypted);

    } catch (error) {
        console.error("\nDecryption failed:", error.message);
    } finally {
        rl.close();
    }
}

main();