// comments[]
// plant id
// photo plant[si plusieurs photos]

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wallSchema = new Schema({

    comments: String,
    picture: String,
    id_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    plants: {
        type: [{ type: Schema.Types.ObjectId, ref: "plant" }],
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;