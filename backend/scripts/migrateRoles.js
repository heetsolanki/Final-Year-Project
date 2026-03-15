/**
 * Migration script to fix legacy role and verificationStatus values in the database.
 *
 * Run with: node scripts/migrateRoles.js
 *
 * This script:
 * 1. Updates User documents with role "user" → "consumer"
 * 2. Updates User documents with role "expert" → "legalExpert"
 * 3. Updates Expert documents with role "expert" → "legalExpert"
 * 4. Updates Expert documents with verificationStatus "verified" → "active"
 * 5. Updates Expert documents with verificationStatus "pending" → "under_review"
 * 6. Updates Expert documents with verificationStatus "incomplete" → "profile_incomplete"
 */

const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    // ── User collection: fix role values ──
    const userRoleFixes = [
      { filter: { role: "user" }, update: { $set: { role: "consumer" } } },
      { filter: { role: "expert" }, update: { $set: { role: "legalExpert" } } },
    ];

    for (const { filter, update } of userRoleFixes) {
      const result = await db.collection("users").updateMany(filter, update);
      console.log(
        `Users: "${filter.role}" → "${update.$set.role}" — ${result.modifiedCount} updated`,
      );
    }

    // ── Expert collection: fix role values ──
    const expertRoleFixes = [
      { filter: { role: "expert" }, update: { $set: { role: "legalExpert" } } },
      { filter: { role: "user" }, update: { $set: { role: "legalExpert" } } },
    ];

    for (const { filter, update } of expertRoleFixes) {
      const result = await db.collection("experts").updateMany(filter, update);
      console.log(
        `Experts role: "${filter.role}" → "${update.$set.role}" — ${result.modifiedCount} updated`,
      );
    }

    // ── Expert collection: fix verificationStatus values ──
    const statusFixes = [
      {
        filter: { verificationStatus: "verified" },
        update: { $set: { verificationStatus: "active", isVerified: true } },
      },
      {
        filter: { verificationStatus: "pending" },
        update: {
          $set: { verificationStatus: "under_review", isVerified: false },
        },
      },
      {
        filter: { verificationStatus: "incomplete" },
        update: {
          $set: { verificationStatus: "profile_incomplete", isVerified: false },
        },
      },
    ];

    for (const { filter, update } of statusFixes) {
      const result = await db.collection("experts").updateMany(filter, update);
      console.log(
        `Experts status: "${filter.verificationStatus}" → "${update.$set.verificationStatus}" — ${result.modifiedCount} updated`,
      );
    }

    // ── Expert collection: ensure isVerified field exists ──
    const missingVerified = await db
      .collection("experts")
      .updateMany(
        { isVerified: { $exists: false } },
        { $set: { isVerified: false } },
      );
    console.log(
      `Experts: added missing isVerified field — ${missingVerified.modifiedCount} updated`,
    );

    console.log("\nMigration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
