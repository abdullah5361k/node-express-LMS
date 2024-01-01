const multer = require("multer")
const AppError = require("../utils/appError.util")
const path = require("path")

const upload = multer({
    dest: "uploads/",
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    limits: {
        fieldNameSize: 400,
        fileSize: 10 * 1024 * 1024, //10 MB
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
            return cb(new AppError(400, `Unsported file type! ${ext}`, false))
        }
        cb(null, true)
    },
})

module.exports = upload