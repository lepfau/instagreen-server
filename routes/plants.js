const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");
const requireAuth = require("../middlewares/requireAuth");
const uploader = require("../config/cloudinary");
const Wall = require("../models/Wall");

//GET ALL PLANTS  IN DB
router.get("/", (req, res, next) => {
  Plant.find()
    .populate("id_user")
    .then((plantsDocument) => {
      res.status(200).json(plantsDocument);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/userplants", (req, res, next) => {
  Plant.find({ id_user: req.session.currentUser })
    .populate("id_user")
    .then((plantsDocument) => {
      res.status(200).json(plantsDocument);
    })
    .catch((error) => {
      next(error);
    });
});

// GET ONE PLANT IN DB

//CREATE PLANT IN DB
router.post("/", requireAuth, uploader.single("image"), (req, res, next) => {
  const updateValues = { ...req.body };

  if (req.file) {
    updateValues.image = req.file.path;
  }
  console.log(req.body);
  updateValues.id_user = req.session.currentUser; // Retrieve the authors id from the session.

  Plant.create(updateValues)
    .then((plantDocument) => {
      plantDocument
        .populate("id_user")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((plant) => {
          console.log("here");
          res.status(201).json(plant); // send the populated document.
        });
    })
    .then((plant) => {
      const wallInfos = {};
      wallInfos.title = `New plant added: ${updateValues.name} `;
      wallInfos.image = updateValues.image;
      wallInfos.id_user = req.session.currentUser;
      console.log("yoyoyo" + wallInfos.image);
      Wall.create(wallInfos);
    })
    .catch(next);
});

//DELETE PLANT IN DB
router.delete("/:id", (req, res, next) => {
  Plant.findByIdAndDelete(req.params.id)
    //   Item.findOne({
    //     $and: [{ id_user: req.session.currentUser }, { _id: req.params.id }],
    //   })
    .then((plantDoc) => {
      res.status(204).json({
        message: "Successfuly deleted",
      });
    })
    .catch((error) => {
      next(error);
    });
});

//UPDATE ONE PLANT IN DB
router.patch(
  "/:id",
  requireAuth,
  uploader.single("image"),
  (req, res, next) => {
    const item = { ...req.body };
    console.log(item);
    Plant.findById(req.params.id)
      .then((itemDocument) => {
        if (!itemDocument)
          return res.status(404).json({ message: "Item not found" });
        if (itemDocument.id_user.toString() !== req.session.currentUser) {
          return res

            .status(403)
            .json({ message: "You are not allowed to update this document" });
        }

        if (req.file) {
          item.image = req.file.path;
        }

        Plant.findByIdAndUpdate(req.params.id, item, { new: true })
          .populate("id_user")
          .then((updatedDocument) => {
            return res.status(200).json(updatedDocument);
          })
          .catch(next);
      })
      .catch(next);
  }
);

router.get("/:id", (req, res, next) => {
  Plant.findById(req.params.id)
    .then((plantDocument) => {
      res.status(200).json(plantDocument);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
