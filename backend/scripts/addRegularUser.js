import bcrypt from "bcrypt";
import { pool } from "../config/database.js";

const regularUser = {
  username: "user",
  role: "user",
  password: "user1234",
  firstname: "Regular",
  lastname: "User",
  phoneNo: "+254700000001",
  module: "reports",
};

async function addRegularUser() {
  console.log("👤 Adding regular user...");

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM reporting.users WHERE username = $1",
      [regularUser.username]
    );

    if (existingUser.rows.length > 0) {
      console.log(
        `   ✅ User '${regularUser.username}' already exists, skipping...`
      );
      return true;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(regularUser.password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO reporting.users (username, role, password, firstname, lastname, "phoneNo", module, "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
             RETURNING id, username, role, firstname, lastname`,
      [
        regularUser.username,
        regularUser.role,
        hashedPassword,
        regularUser.firstname,
        regularUser.lastname,
        regularUser.phoneNo,
        regularUser.module,
      ]
    );

    const user = result.rows[0];
    console.log(`   ✅ User '${user.username}' created successfully`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Name: ${user.firstname} ${user.lastname}`);
    console.log(
      `   - Password: ${regularUser.password} (change this after first login)`
    );
    console.log("\n🔑 Login credentials:");
    console.log(`   Username: ${regularUser.username}`);
    console.log(`   Password: ${regularUser.password}`);
    console.log(
      `   Role: ${regularUser.role} (Limited access - cannot manage facilities or mappings)`
    );
    console.log(
      "\n⚠️  Remember to change the default password after first login!"
    );

    return true;
  } catch (error) {
    console.error(`   ❌ Error creating user:`, error.message);
    return false;
  }
}

// Run the script
addRegularUser()
  .then((success) => {
    if (success) {
      console.log("\n🎉 Regular user added successfully!");
      process.exit(0);
    } else {
      console.log("\n❌ Failed to add regular user");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Script error:", error);
    process.exit(1);
  });






