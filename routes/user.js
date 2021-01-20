const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res, next) => {
    User.find()
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            next(error);
        });
});

router.get("/:id", (req, res, next) => {
    User.findById(req.params.id)
        .then((userDocument) => {
            res.status(200).json(userDocument);
        })
        .catch((error) => {
            next(error);
        });
});


module.exports = router;