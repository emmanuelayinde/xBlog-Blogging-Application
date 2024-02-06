const { searchAll, searchForPost, searchForUser, searchForComment } = require("../controllers/searchControllers");

const router = require("express").Router();

/**
 * @GET
 */
router.get("/", searchAll);
router.get("/post", searchForPost);
router.get("/user", searchForUser);
router.get("/comment", searchForComment);



module.exports = router;
