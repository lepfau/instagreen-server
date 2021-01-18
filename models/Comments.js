
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({

    author: String,

    text: String,
    id_wall: {
        type: Schema.Types.ObjectId,
        ref: "Wall",
    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },


},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;