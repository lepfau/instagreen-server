const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth");

const protectRoute = require("./../middlewares/protectRoute")

router.use(protectRoute);

router.get("/", (req, res, next) => {
  Item.find({})
    .populate("id_user")
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

router.post("/", requireAuth, uploader.single("image"), (req, res, next) => {
  const updateValues = { ...req.body };

  if (req.file) {
    updateValues.image = req.file.path;
  }

  updateValues.id_user = req.session.currentUser;

  Item.create(updateValues)
    .then((itemDocument) => {
      itemDocument
        .populate("id_user")
        .execPopulate()
        .then((item) => {
          console.log("here");
          res.status(201).json(item);
        })
        .catch(next);
    })
    .catch(next);
});

router.patch(
  "/:id",
  requireAuth,
  uploader.single("image"),
  (req, res, next) => {
    const item = { ...req.body };

    Item.findById(req.params.id)
      .then((itemDocument) => {
        if (!itemDocument)
          return res.status(404).json({ message: "Item not found" });
        if (itemDocument.id_user.toString() !== req.session.currentUser) {
          return res
            .status(403)
            .json({ message: "You are not allowed to update this document" });
        }

        if (req.file) {
          item.image = req.file.secure_url;
        }

        Item.findByIdAndUpdate(req.params.id, item, { new: true })
          .populate("id_user")
          .then((updatedDocument) => {
            return res.status(200).json(updatedDocument);
          })
          .catch(next);
      })
      .catch(next);
  }
);

router.delete("/:id", requireAuth, (req, res, next) => {
  Item.findById(req.params.id)
    .then((itemDocument) => {
      if (!itemDocument) {
        return res.status(404).json({ message: "Item not found" });
      }
      if (itemDocument.id_user.toString() !== req.session.currentUser) {
        return res.status(403).json({ message: "You can't delete this item" });
      }

      Item.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
