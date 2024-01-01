const Course = require("../models/course.model");
const AppError = require("../utils/appError.util");
const saveImageOnCloud = require("../utils/saveImage.util");

exports.createLecture = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { courseId } = req.params;
        if (!title || !description || !req.file) {
            return next(new AppError(400, "All fields are mandatory"))
        }

        // Save image on Cloud
        const result = await saveImageOnCloud(req, next)
        if (!result) {
            // Delete file
            fs.unlinkSync(`uploads/${req.file.filename}`)
            return;
        }

        const newLecture = {
            title: title,
            description: description,
            thumbnail: {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
        };
        const lecture = await Course.findByIdAndUpdate(courseId, { $push: { lectures: newLecture } }, { new: true });
        if (!lecture) {
            return next(new AppError(400, "No course found"))
        }
        return res.status(200).json({
            success: true,
            message: "Lectures added successfully"
        })
    } catch (err) {
        return next(new AppError(400, "Lecture not found"))
    }
}

// Fetch lectures
exports.fetchLecture = async (req, res, next) => {
    try {
        const { courseId } = req.params
        const lectures = await Course.findById(courseId).select("lectures");
        if (lectures.lectures.length == 0) {
            return next(new AppError(400, "No lecture found"))
        }
        return res.status(200).json({
            success: true,
            message: "Lectured fetched successfull",
            lectures
        })
    } catch (err) {
        return next(new AppError(400, "Lecture not found"))
    }
}