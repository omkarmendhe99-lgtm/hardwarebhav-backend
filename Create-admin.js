require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./Admin-model");

const ADMIN_EMAIL = "admin@hardwarebhav.in";
const ADMIN_PASSWORD = "ChangeThis123!";

async function createAdmin() {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected");

        const existingAdmin = await Admin.findOne({
            email: ADMIN_EMAIL
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const passwordHash =
            await bcrypt.hash(ADMIN_PASSWORD, 12);

        await Admin.create({
            email: ADMIN_EMAIL,
            passwordHash: passwordHash
        });

        console.log("✅ Admin account created successfully!");
        console.log("Email:", ADMIN_EMAIL);

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {

        console.error("❌ Admin creation error:", error);

        process.exit(1);
    }
}

createAdmin();