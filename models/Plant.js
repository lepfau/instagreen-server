const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({

    name: String,
    description: String,
    age: Number,

    image: {
        type: String,
        default:
            "https://cdn1.iconfinder.com/data/icons/gardening-filled-line/614/1935_-_Growing_Plant-512.png",
    },
    characteristics: {
        enlightment: String,
        watering: String,
        growingperiod: String
    },

    id_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        { type: Schema.Types.ObjectId, ref: "user" }],

    comments: [
        { type: Schema.Types.ObjectId, ref: "user" }]

},

    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
