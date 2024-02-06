const router = require("express").Router();
const multer = require("multer");
const {
  uploadMultipleFiles,
  uploadFile,
} = require("../controllers/uploadControllers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

/**
 * @POST
 */
router.post("/", upload.single("file"), uploadFile);
router.post("/multiple", upload.array("files", 4), uploadMultipleFiles);

module.exports = router;
