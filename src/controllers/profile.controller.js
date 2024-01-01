const Profile = require("../models/profile.model");
const AppError = require("../utils/appError.util");
const saveImageOnCloud = require("../utils/saveImage.util");
const fs = require("fs");

exports.createProfile = async (req, res, next) => {
    const { name } = req.body;
    const user = req.user.id
    try {
        const profile = new Profile({ user, name });

        // Save Image on cloud
        const result = await saveImageOnCloud(req, next);
        if (!result) {
            // Delete file
            fs.unlinkSync(`uploads/${req.file.filename}`)
            return;
        }
        profile.avatar.public_id = result.public_id;
        profile.avatar.secure_Url = result.secure_url;
        await profile.save();
        // Delete file
        fs.unlinkSync(`uploads/${req.file.filename}`)
        // Response 
        return res.status(200).json({
            success: true,
            message: "User's profile stored successfull",
            profile
        })

    } catch (err) {
        return next(new AppError(500, err.message))
    }
}

exports.getProfile = async (req, res) => {
    const user = req.user.id
    try {
        const getProfile = await Profile.findOne({ user }).populate("user");
        return res.status(200).json({
            success: true,
            message: "Profile found",
            getProfile
        })
    } catch (err) {
        return next(new AppError(500, err.message))
    }
}