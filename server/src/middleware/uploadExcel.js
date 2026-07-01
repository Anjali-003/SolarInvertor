const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../temp/uploads");

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}

// Configure how uploaded files are stored
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);

    },

    filename: function (req, file, cb) {

        const timestamp = new Date()
            .toISOString()
            .replace(/:/g, "-")
            .replace(/\..+/, "");

        cb(
            null,
            `imei-upload-${timestamp}${path.extname(file.originalname)}`
        );

    }

});

// Only allow Excel files
function fileFilter(req, file, cb) {

    const allowedExtensions = [
        ".xlsx",
        ".xls"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {

        return cb(
            new Error(
                "Only Excel (.xlsx, .xls) files are allowed."
            ),
            false
        );

    }

    cb(null, true);

}

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

module.exports = upload;