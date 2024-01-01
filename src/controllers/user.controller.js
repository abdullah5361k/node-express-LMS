const { validationResult } = require("express-validator")
const AppError = require("../utils/appError.util")
const User = require("../models/user.model")
const fs = require("fs")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const sendEmail = require("../utils/emailCou.util")

const httpOptions = {
    maxAge: 24 * 60 * 60 * 1000,  // Would expire in 24 hours
    httpOnly: true,
    secure: true,
    sameSite: "None"
}

// Register user in DB
exports.registerUser = async (req, res, next) => {
    // Todos
    // Req Validation 
    if (reqValidation(req, res, next)) {
        return;
    }

    try {
        const { fullName, email, password } = req.body
        // check user email already exist in DB or not
        const userExists = await isEmailExistsInDb(email, next)
        // If user  exist
        if (userExists) {
            return next(new AppError(409, `User with this ${email} already register`))
        }

        // Store user in Db
        const user = await storeUserCredentialsInDb(req.body, next)
        if (!user) {
            return;
        }

        // If user store in DB 

        // generate jwt token
        const token = await user.generateJwtToken()

        // Set token in cookies
        res.cookie("token", token, httpOptions)

        // delete password
        user.password = undefined

        // Send response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        })

    } catch (err) {
        return next(new AppError(500, err.message))
    }
}

// Login User
exports.loginUser = async (req, res, next) => {
    // Req validation
    if (reqValidation(req, res, next)) {
        return;
    }
    try {
        const { email, password } = req.body
        // Email exists in DB
        const userExists = await isEmailExistsInDb(email, next)
        // If email not exists in DB than return error
        if (!userExists) {
            return next(new AppError(400, `User with ${email} not registers, Please register yourself first`))
        }

        // Compare password
        const matchPassword = await bcrypt.compare(password, userExists.password)

        if (!matchPassword) {
            return next(new AppError(400, "Please provide valid password"))
        }

        // Generate JWT token
        const token = await userExists.generateJwtToken()
        // Set token in cookies
        res.cookie("token", token, httpOptions)
        // delete password
        userExists.password = undefined
        //  Send success responses
        return res.status(200).json({
            success: true,
            message: "User login successfully",
            userExists
        })


    } catch (err) {
        return next(new AppError(500, err.message || "Some server errors"))
    }
}

// logout User
exports.logOut = (req, res, next) => {
    const options = {
        maxAge: 0,
        secure: true,
        httpOnly: true
    }

    res.cookie("token", null, options)
    return res.status(200).json({
        success: true,
        message: "User logout successfully"
    })
}

// Forgot password
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        // If email not provid
        if (!email) {
            return next(new AppError(400, "Please provide valid email"));
        }
        // Check provided email exists or not
        const user = await isEmailExistsInDb(email, next);
        // If not then return error
        if (!user) {
            return next(new AppError(400, `User with this ${user.email} not register`));
        }

        const token = await user.generateForgotPasswordToken();

        const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const requestId = await sendEmail(resetPasswordURL, email) // Send Email
        if (!requestId) {
            return;
        }
        await user.save()
        res.status(200).json({
            success: true,
            message: "Email send successfully"
        })

    } catch (err) {
        return next(new AppError(400, err.message))
    }
}

// Reset password
exports.resetPassword = async (req, res, next) => {
    // Req Validation for password
    if (reqValidation(req, res, next)) {
        return;
    }
    try {
        const { resetToken } = req.params
        const { newPassword } = req.body
        const forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const user = await User.findOne({ forgotPasswordToken, forgotPasswordExpiry: { $gt: Date.now() } })
        if (!user) {
            return next(new AppError(403, "Password reset token has expired"))
        }
        user.password = newPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })

    } catch (err) {
        return next(new AppError(500, err.message || "Something happed wrong"))
    }
}

// Change Password
exports.changePassword = async (req, res, next) => {
    // Req Validation 
    if (reqValidation(req, res, next)) {
        return;
    }
    try {
        const { email } = req.user;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findOne({ email })

        // Compare password
        const matchPassword = await bcrypt.compare(oldPassword, user.password)

        if (!matchPassword) {
            return next(new AppError(400, "Old password is wrong"))
        }

        user.password = newPassword;
        // Save user
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (err) {
        return next(new AppError(400, err.message || "Some thing wrong"))
    }
}

// Validation on req body
function reqValidation(req, res, next) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    // if there is error then return Error
    if (!errors.isEmpty()) {
        next(new AppError(400, errors.array()))
        return true
    }
    return false
}

// Fun to Store user in DB
async function storeUserCredentialsInDb({ fullName, email, password }, next) {
    try {
        // const { fullName, email, password } = req.body
        const user = await User.create({
            fullName, email, password
        })
        return user
    } catch (err) {
        return next(new AppError(500, err.message || "Error during store user in DB"))

    }
}


// check email in Db
async function isEmailExistsInDb(email, next) {
    try {
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return emailExists
        }
    } catch (error) {
        return next(new AppError(500, err.message || "Error during verify email"))
    }
}