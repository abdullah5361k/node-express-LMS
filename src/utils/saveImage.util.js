
const cloudinary = require("cloudinary")

// Save image on Cloudinary
async function saveImage({ file }, next) {

    if (file) {
        try {
            const result = await cloudinary.v2.uploader.upload(file.path, {
                folder: "lms",
                gravity: "faces",
                crop: "fill"
            })

            return result
        } catch (error) {
            return next(new AppError(500, error || "File not uploaded, try again"))
        }
    }
}

module.exports = saveImage