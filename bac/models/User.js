const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        // ==========================================
        // User Name
        // ==========================================

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },

        // ==========================================
        // Email
        // ==========================================

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: validator.isEmail,
                message: "Please enter a valid email",
            },
        },

        // ==========================================
        // Password
        // ==========================================

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },

        // ==========================================
        // Phone
        // ==========================================

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        // ==========================================
        // Role
        // ==========================================

        role: {
            type: String,
            enum: [
                "Citizen",
                "Volunteer",
                "RescueTeam",
                "Hospital",
                "Police",
                "NGO",
                "DistrictAdmin",
                "SuperAdmin",
            ],
            default: "Citizen",
        },

        // ==========================================
        // Address
        // ==========================================

        address: {
            type: String,
            default: "",
            trim: true,
        },

        city: {
            type: String,
            default: "",
            trim: true,
        },

        state: {
            type: String,
            default: "",
            trim: true,
        },

        pincode: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // Profile Image
        // ==========================================

        profileImage: {
            type: String,
            default: "",
        },

        // ==========================================
        // User GPS Location
        // ==========================================

        location: {
            latitude: {
                type: Number,
                default: null,
            },

            longitude: {
                type: Number,
                default: null,
            },
        },

        // ==========================================
        // Verification
        // ==========================================

        isVerified: {
            type: Boolean,
            default: false,
        },

        // ==========================================
        // Account Status
        // ==========================================

        isActive: {
            type: Boolean,
            default: true,
        },

        // ==========================================
        // Last Login
        // ==========================================

        lastLogin: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);


// ==========================================
// Hash Password Before Save
// ==========================================

userSchema.pre("save", async function () {

    // Mongoose 9 async middleware does not use the legacy `next` callback.
    // Returning from this async function tells Mongoose the hook is complete.
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// ==========================================
// Compare Password
// ==========================================

userSchema.methods.comparePassword = async function (
    enteredPassword
) {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};


// ==========================================
// Remove Password From JSON Response
// ==========================================

userSchema.methods.toJSON = function () {

    const obj = this.toObject();

    delete obj.password;

    return obj;
};


// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model(
    "User",
    userSchema
);