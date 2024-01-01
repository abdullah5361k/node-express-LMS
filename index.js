require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080
const dbConnection = require("./config/db.config")
const userRouter = require("./src/routes/user.route")
const courseRouter = require("./src/routes/course.route");
const lectureRouter = require("./src/routes/lecture.route");
const profileRouter = require("./src/routes/profile.route");
const cors = require("cors")
const cookieParser = require('cookie-parser')
const errorMiddleware = require("./src/middlewares/error.middleware")
const bodyParser = require('body-parser');
const cloudinary = require("cloudinary");


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// User Routes
app.use("/api/v1/user", userRouter)

// Courses Routes
app.use("/api/v1/course", courseRouter)

// Lectures Routes
app.use("/api/v1/lectures", lectureRouter)

// Profile Routes
app.use("/api/v1/profile", profileRouter)

// 404
app.all("*", (req, res) => {
    res.status(404).send("OPPS! 404 page not found")
})

// Error hanler
app.use(errorMiddleware)

app.listen(PORT, async () => {
    await dbConnection()
    console.log(`Server is running on ${PORT}`)
})