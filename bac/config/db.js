const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is not defined in .env"
            );
        }

        const connection = await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("====================================");
        console.log(" MongoDB Connected Successfully");
        console.log(
            ` Database : ${connection.connection.name}`
        );
        console.log(
            ` Host : ${connection.connection.host}`
        );
        console.log("====================================");

        return connection;
    } catch (error) {
        console.error("====================================");
        console.error(" MongoDB Connection Failed");
        console.error(` ${error.message}`);
        console.error("====================================");

        // Let server.js handle the startup failure.
        throw error;
    }
};

module.exports = connectDB;