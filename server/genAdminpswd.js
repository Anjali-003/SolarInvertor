const bcrypt = require("bcrypt");

async function generatePassword() {

    const plainPassword = "admin123";   // Change this if you want

    const hash = await bcrypt.hash(plainPassword, 10);

    console.log("\nPassword:");
    console.log(plainPassword);

    console.log("\nHash:");
    console.log(hash);
}

generatePassword();