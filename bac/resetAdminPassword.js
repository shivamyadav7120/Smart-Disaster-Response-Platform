const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const email = "shivam@gmail.com";
        const newPassword = "Admin@123";

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        const user = await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                isActive: true,
                isVerified: true,
            },
            { new: true }
        ).select("+password");

        if (!user) {
            console.log("❌ User not found");
            process.exit(1);
        }

        console.log("✅ Admin password reset successfully");
        console.log("Email:", user.email);
        console.log("Password:", newPassword);
        console.log("Role:", user.role);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

resetPassword();