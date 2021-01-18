const express = require("express");
const router = express.Router();
const Comment = require("../models/Comments");
const requireAuth = require("../middlewares/requireAuth");


router.get("/", (req, res, next) => {
    Comment.find()
        .populate("id_user")

        .then((comDocument) => {
            res.status(200).json(comDocument);
        })
        .catch((error) => {
            next(error);
        });
});



router.post("/", requireAuth, (req, res, next) => {
    const updateValues = { ...req.body };
    console.log(updateValues)
    updateValues.id_user = req.session.currentUser; // Retrieve the authors id from the session.

    Comment.create(updateValues)
        .then((commDocument) => {
            commDocument
                .populate("id_user")
                .populate("id_wall")
                .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
                .then((comment) => {
                    console.log("here");
                    res.status(201).json(comment); // send the populated document.
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;