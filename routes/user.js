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

router.get("/search/api", async (req, res, next) => {
    // req.body (posted infos)
    // req.params (variable/dynamique part of a route path)
    // req.query (access infos from for with get method)
    try {
        console.log(req.query); // query strings
        const exp = new RegExp(req.query.search); // creating a regular expression
        const matchedUsers = await User.find({ firstName: { $regex: exp } });

        res.json(
            matchedUsers
        )
    } catch (err) {
        next(err);
    }
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