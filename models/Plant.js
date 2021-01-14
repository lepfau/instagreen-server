const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema({

    name: String,
    description: String,
    image: {
        type: String,
        default:
            "https://cdn1.iconfinder.com/data/icons/gardening-filled-line/614/1935_-_Growing_Plant-512.png",
    },
    enlightment: String,
    watering: String,
    wateringinterval: Number,
    growingperiod: String,
    isWatered: Boolean,
    waterDate: Date,

    id_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

},

    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
