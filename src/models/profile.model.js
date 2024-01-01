const mongoose = require("mongoose");
const { Schema } = mongoose;

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_Url: {
            type: String
        }
    },
    name: {
        type: String
    }
})

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;