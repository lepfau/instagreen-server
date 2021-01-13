const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImg: {
    type: String,
    default:
      "https://vignette.wikia.nocookie.net/simpsons/images/1/14/Ralph_Wiggum.png/revision/latest/top-crop/width/360/height/360?cb=20100704163100",
  },
  friends: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  plants: {
    type: [{ type: Schema.Types.ObjectId, ref: "plant" }], // NEEDS TO BE CHECKED
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
