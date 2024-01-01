const express = require("express");
const lectureRouter = express.Router();
const lectureController = require("../controllers/lecture.controller")
const upload = require("../middlewares/multer.middleware");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware")

// , role("ADMIN")
lectureRouter.post("/create/:courseId", upload.single("thumbnail"), auth, role("ADMIN"), lectureController.createLecture);
lectureRouter.get("/all-lectures/:courseId", auth, lectureController.fetchLecture)

module.exports = lectureRouter;