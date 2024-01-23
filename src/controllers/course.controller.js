const AppError = require("../utils/appError.util")
const Course = require("../models/course.model");
const storeImageOnCloud = require("../utils/saveImage.util");
const fs = require("fs");

// Create course
exports.createCourse = async (req, res, next) => {
    try {
        // Get data from request body
        let { title, description, category, price, createdBy } = req.body;
        // If any of required field not given
        if (!title || !description || !category || !req.file || !createdBy) {
            return next(new AppError(400, "All fields are mandatory"))
        }

        const course = new Course({ title, description, category, price, createdBy });
        // Store Image on cloud
        const result = await storeImageOnCloud(req, next);
        if (!result) {
            // Delete file
            fs.unlinkSync(`uploads/${req.file.filename}`)
            return;
        }
        // If image stored on Cloud add image url to DB
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
        await course.save()

        // Delete file
        fs.unlinkSync(`uploads/${req.file.filename}`)

        // Response
        return res.status(201).json({
            success: true,
            message: "Course Created successfully",
            course
        })

    } catch (err) {
        return next(new AppError(500, err.message || "Some thing went wrong"))
    }

}

// Delete course
exports.deleteCourse = async (req, res, next) => {
    try {
        // Get data from request
        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId)
        // If course not found in DB send error
        if (!course) {
            return next(new AppError(400, "No course found"))
        }
        // Else response
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            course
        })
    } catch (err) {
        if (err.kind === "ObjectId") {
            return next(new AppError(400, "Invalid courseId"))
        }
        return next(new AppError(400, err.message))
    }
}

// Update Course
exports.updateCourse = async (req, res, next) => {
    try {
        // Get data from request
        const { courseId } = req.params;
        // Update course fields in DB
        const course = await Course.findByIdAndUpdate(courseId, { $set: req.body }, { new: true, runValidators: true })
        // If image file provide then store file on Cloud
        if (req.file) {
            const result = await storeImageOnCloud(req, next);
            if (!result) {
                fs.unlinkSync(`uploads/${req.file.filename}`)
                return;
            }
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
            await course.save();
            fs.unlinkSync(`uploads/${req.file.filename}`)
        }
        // send response
        return res.status(200).json({
            success: true,
            message: "Course updated successully",
            course
        })
    } catch (error) {
        if (err.kind === "ObjectId") {
            return next(new AppError(400, "Invalid courseId"))
        }
        if (err.name === "ValidationError") {
            return next(new AppError(400, err.message))
        }
        return next(new AppError(400, err.message))
    }
}

// Get all courses
exports.fetchCourse = async (req, res, next) => {
    try {
        const courses = await Course.find();
        if (!courses) {
            return next(new AppError(200, "No user found"))
        }
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        })
    } catch (err) {
        return next(new AppError(500, err.message))
    }
}
