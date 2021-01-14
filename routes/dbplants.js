const express = require("express");
const router = express.Router();
const DbPlant = require("../models/DbPlant");
const requireAuth = require("../middlewares/requireAuth");
const uploader = require("../config/cloudinary");


//GET ALL PLANTS  IN DB
router.get("/", (req, res, next) => {
    DbPlant.find()
        .then((plantsDocument) => {
            res.status(200).json(plantsDocument);
        })
        .catch((error) => {
            next(error);
        });
});


router.post("/", requireAuth, uploader.single("image"), (req, res, next) => {
    const updateValues = { ...req.body };

    if (req.file) {
        updateValues.image = req.file.path;
    }

    // Retrieve the authors id from the session.

    DbPlant.create(updateValues)
        .then((plantDocument) => {
            plantDocument
                .populate("id_user")
                .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
                .then((plant) => {
                    console.log("here");
                    res.status(201).json(plant); // send the populated document.
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;