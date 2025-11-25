// this is a one time file to hass the passwords in database that was added before hashing was implemented.
// hashPasswords.js
const bcrypt = require("bcrypt");

async function hashPasswords() {
  const newPassword = "Password1"; // the password you want for all users
  const numberOfUsers = 23; // total users in your DB

  for (let i = 1; i <= numberOfUsers; i++) {
    const hashed = await bcrypt.hash(newPassword, 10);
    console.log(`User ${i} hashed password: ${hashed}`);
  }
}

hashPasswords();
