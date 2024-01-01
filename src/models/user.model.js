const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: String
}, { timestamps: true })

// Mongoose methods
userSchema.methods = {
    generateJwtToken: async function () {
        const payLoad = {
            id: this._id,
            email: this.email,
            role: this.role
        }
        const jwtToken = await jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours 
        })
        return jwtToken
    },

    generateForgotPasswordToken: function () {
        const resetToken = crypto.randomBytes(20).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        this.forgotPasswordToken = hashedToken;
        this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; // 15 min from now
        return resetToken;
    }
}

// Middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User