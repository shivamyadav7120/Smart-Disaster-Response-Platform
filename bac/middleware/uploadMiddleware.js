const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// Upload Directories
// ==========================================

const uploadDir = path.join(__dirname, "../uploads");
const sosDir = path.join(uploadDir, "sos");

// Create upload directories
if (!fs.existsSync(sosDir)) {
    fs.mkdirSync(sosDir, {
        recursive: true
    });
}

// ==========================================
// Storage Configuration
// ==========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        // SOS images will be stored here
        cb(null, sosDir);

    },

    filename: (req, file, cb) => {

        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const uniqueName =
            `sos-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

        cb(null, uniqueName);

    }

});

// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );

    }

};

// ==========================================
// Multer Configuration
// ==========================================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        // Maximum 5 MB per image
        fileSize: 5 * 1024 * 1024,

        // Maximum 5 images
        files: 5

    }

});

// ==========================================
// Export
// ==========================================

module.exports = upload;