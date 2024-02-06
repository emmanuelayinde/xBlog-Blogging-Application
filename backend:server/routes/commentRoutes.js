const { addCommentToPost, reactToComment, deleteComment } = require("../controllers/commentControllers");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

/**
 * @GET
 */
// router.get("/:slug", getSinglePost);

/**
 * @POST
 */
router.post("/:postSlug", authenticate, addCommentToPost);

/**
 * @UPDATE
 */
router.put("/:commentId", authenticate, reactToComment)

/**
 * @DELETE
 */
router.delete("/:postSlug/:commentId", authenticate, deleteComment)


module.exports = router;
