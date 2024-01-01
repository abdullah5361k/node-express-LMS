const express = require("express")
const userRouter = express.Router()
const userControllers = require("../controllers/user.controller")
const registerBodyValidation = require("../middlewares/registerValidation.middleware")
const upload = require("../middlewares/multer.middleware")
const loginBodyRegistration = require("../middlewares/loginValidation.middleware")
const auth = require("../middlewares/auth.middleware")
const passwordValidation = require("../middlewares/passwordValidaotr.middleware")


userRouter.post("/register", registerBodyValidation, userControllers.registerUser)
userRouter.post("/login", loginBodyRegistration, userControllers.loginUser)
userRouter.get("/logout", auth, userControllers.logOut)
userRouter.post("/forgot-password", userControllers.forgotPassword)
userRouter.post("/reset-password/:resetToken", passwordValidation, userControllers.resetPassword)
userRouter.post("/change-password", auth, passwordValidation, userControllers.changePassword)

module.exports = userRouter