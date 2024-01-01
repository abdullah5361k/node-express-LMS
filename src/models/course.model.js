const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    price: {
        type: String,
        required: [true, "Price is required"]
    },
    thumbnail: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    lectures: [
        {
            title: {
                type: String,
                required: [true, "title is required"]
            },
            description: {
                type: String,
                required: [true, "Des is required"]
            },
            thumbnail: {
                public_id: {
                    type: String,
                },
                secure_url: {
                    type: String
                }
            }
        }
    ]
}, { timestamps: true });


const Course = mongoose.model("Course", courseSchema);

module.exports = Course;