const express = require("express");
const router = express.Router();
const Wall = require("../models/Wall");
const requireAuth = require("../middlewares/requireAuth");
const uploader = require("../config/cloudinary");
const { urlencoded } = require("express");
const Comment = require("../models/Comments");
const { update } = require("../models/Wall");
const User = require("../models/User");

//DISPLAY ALL PICTURES ON WALL
router.get("/", (req, res, next) => {
  Wall.find()
    .populate("id_user id_comments")
    .populate({
      path: "id_comments",
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: "id_user" },
    })
    .populate({
      path: "likes",
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: "id_user" },
    })
    .then((wallDocument) => {
      res.status(200).json(wallDocument);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/profileposts", (req, res, next) => {
  Wall.find({ id_user: req.session.currentUser })
    .populate("id_user id_comments")
    .populate({
      path: "id_comments",
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: "id_user" },
    })
    .then((wallDocument) => {
      res.status(200).json(wallDocument);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  Wall.find({ id_user: req.params.id })
    .populate("id_user id_comments")
    .populate({
      path: "id_comments",
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: "id_user" },
    })
    .then((wallDocument) => {
      res.status(200).json(wallDocument);
    })
    .catch((error) => {
      next(error);
    });
});

//UPDATE POST ON WALL
router.patch(
  "/:id",
  requireAuth,
  uploader.single("image"),
  (req, res, next) => {
    const post = { ...req.body };
    console.log(post);
    Wall.findById(req.params.id)
      .then((itemDocument) => {
        if (!itemDocument)
          return res.status(404).json({ message: "Item not found" });

        if (req.file) {
          post.image = req.file.path;
        }

        Wall.findByIdAndUpdate(
          req.params.id,
          post,

          { new: true }
        )
          .populate("id_user")
          .then((updatedDocument) => {
            return res.status(200).json(updatedDocument);
          })
          .catch(next);
      })
      .catch(next);
  }
);

//CREATE ARTICLE ON WALL
router.post("/", requireAuth, uploader.single("image"), (req, res, next) => {
  const updateValues = { ...req.body };

  if (req.file) {
    updateValues.image = req.file.path;
  }

  updateValues.id_user = req.session.currentUser; // Retrieve the authors id from the session.

  Wall.create(updateValues)
    .then((walldoc) => {
      return User.findByIdAndUpdate(updateValues.id_user, {
        $push: { posts: walldoc },
      });
    })
    .then((recipeDocument) => {
      recipeDocument
        .populate("id_user")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((recipe) => {
          console.log("here");
          res.status(201).json(recipe); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

router.post("/:id/comments", (req, res, next) => {
  const updateValues = { ...req.body };
  updateValues.id_user = req.session.currentUser;
  Comment.create(updateValues)
    .then((commentdoc) => {
      return Wall.findByIdAndUpdate(commentdoc.id_wall, {
        $push: { id_comments: commentdoc },
      });
    })
    .then((doc) => {
      res.status(201).json(doc);
    })

    .catch(next);
});

router.post("/:id/likes", (req, res, next) => {
  const updateValues = { ...req.body };
  updateValues.id_user = req.session.currentUser;
  Wall.findByIdAndUpdate(req.params.id, {
    $addToSet: { likes: updateValues.id_user },
  }).then((doc) => {
    res.status(201).json(doc);
  });
});

router.delete("/:id/likes", (req, res, next) => {
  const updateValues = { ...req.body };
  updateValues.id_user = req.session.currentUser;
  Wall.findByIdAndUpdate(req.params.id, {
    $pull: { likes: updateValues.id_user },
  }).then((doc) => {
    res.status(204).json({ message: "like removed for user" });
  });
});

//DELETE POST ON WALL
router.delete("/:id", (req, res, next) => {
  Wall.findByIdAndDelete(req.params.id)
    .then((walldoc) => {
      return User.findByIdAndUpdate(walldoc.id_user, {
        $pull: { posts: walldoc._id },
      });
    })

    .then((postDoc) => {
      res.status(204).json({
        message: "Successfuly deleted",
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
