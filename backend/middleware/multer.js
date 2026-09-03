import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDirectory = "uploads";

/* =========================================================
   ENSURE UPLOAD DIRECTORY EXISTS
========================================================= */

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

/* =========================================================
   STORAGE
========================================================= */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension =
            path.extname(file.originalname);

        const baseName =
            path
                .basename(
                    file.originalname,
                    extension
                )
                .replace(/[^a-zA-Z0-9-_]/g, "_");

        const uniqueName =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}-${baseName}${extension}`;

        cb(null, uniqueName);
    },
});

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (
        allowedMimeTypes.includes(
            file.mimetype
        )
    ) {
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

/* =========================================================
   UPLOAD CONFIGURATION
========================================================= */

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 1,
    },
});

export default upload;