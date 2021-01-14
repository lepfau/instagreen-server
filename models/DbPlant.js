const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dbPlantSchema = new Schema({

    name: String,
    image: {
        type: String,
        default:
            "https://cdn1.iconfinder.com/data/icons/gardening-filled-line/614/1935_-_Growing_Plant-512.png",
    },

    enlightment: String,
    watering: String,
    waterdays: Number,
    mintemp: Number,
    maxtemp: Number,
    growingperiod: String


},

);

const DbPlant = mongoose.model("DBPlant", dbPlantSchema);

module.exports = DbPlant;
