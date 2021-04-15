const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/myprofile", (req, res, next) => {
  User.findById(req.session.currentUser)
    .populate("posts")
    .populate({
      path: "posts",
      populate: { path: "id_comments" },
    })
    .populate({
      path: "posts",
      populate: { path: "id_user" },
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/myprofile/items", requireAuth, (req, res, next) => {
  const currentUserId = req.session.currentUser; // We retrieve the users id from the session.

  // And then get all the items matching the id_user field that matches the logged in users id.
  Item.find({ id_user: currentUserId })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

router.get("/search/api", async (req, res, next) => {
  // req.body (posted infos)
  // req.params (variable/dynamique part of a route path)
  // req.query (access infos from for with get method)
  try {
    console.log(req.query); // query strings
    const exp = new RegExp(req.query.search); // creating a regular expression
    const matchedUsers = await User.find({ firstName: { $regex: exp } });

    res.json(matchedUsers);
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
