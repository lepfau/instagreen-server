
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wallSchema = new Schema({

    title: String,
    author: String,
    subtitle: String,
    comments: [String],
    image: {
        type: String,
        default:
            "https://cdn1.iconfinder.com/data/icons/gardening-filled-line/614/1935_-_Growing_Plant-512.png",
    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },


});

const Wall = mongoose.model("Wall", wallSchema);

module.exports = Wall;