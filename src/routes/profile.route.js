const express = require("express");
const profileRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const { createProfile, getProfile } = require("../controllers/profile.controller");
const upload = require("../middlewares/multer.middleware")

profileRouter.post("/create", auth, upload.single("avatar"), createProfile);
profileRouter.get("/get", auth, getProfile)

module.exports = profileRouter;