const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/course.controller")
const upload = require("../middlewares/multer.middleware");
const auth = require("../middlewares/auth.middleware")
const role = require("../middlewares/role.middleware");

// , role("ADMIN")
courseRouter.post("/create", upload.single("thumbnail"), auth, role("ADMIN"), courseController.createCourse);
courseRouter.delete("/delete/:courseId", auth, role("ADMIN"), courseController.deleteCourse)
courseRouter.patch("/update/:courseId", upload.single("thumbnail"), auth, role("ADMIN"), courseController.updateCourse)
courseRouter.get("/get", auth, courseController.fetchCourse)

module.exports = courseRouter;