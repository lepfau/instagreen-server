const express = require("express");
const router = express.Router();
const Wall = require("../models/Wall");
const requireAuth = require("../middlewares/requireAuth");
const uploader = require("../config/cloudinary");

//DISPLAY ALL PICTURES ON WALL
router.get("/", (req, res, next) => {
    Wall.find()
        .populate("id_user")
        .then((wallDocument) => {


            res.status(200).json(wallDocument);
        })
        .catch((error) => {
            next(error);
        });
});

//UPDATE POST ON WALL (FOR COMMENTS MOSTLY)
router.patch(
    "/:id",
    requireAuth,
    uploader.single("image"),
    (req, res, next) => {

        const item = { ...req.body };
        console.log(item)
        Wall.findById(req.params.id)
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

                Wall.findByIdAndUpdate(req.params.id, item, { new: true })
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
        .then((wallDocument) => {
            wallDocument
                .populate("id_user")
                .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
                .then((wall) => {
                    console.log("here");
                    res.status(201).json(wall); // send the populated document.
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;