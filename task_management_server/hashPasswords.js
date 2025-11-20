// this is a one time file to hass the passwords in database that was added before hashing was implemented.
const bcrypt = require("bcrypt");

async function hashPasswords() {
  const passwords = [
    "password123",
    "password123",
    "password123",
    "password123",
    "password123",
  ];

  for (let i = 0; i < passwords.length; i++) {
    const hashed = await bcrypt.hash(passwords[i], 10);
    console.log(`User ${i + 1} hashed password: ${hashed}`);
  }
}

hashPasswords();
