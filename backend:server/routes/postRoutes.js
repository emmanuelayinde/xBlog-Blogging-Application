const {
  createNewPost,
  getSinglePost,
  getHomePosts,
  updatePost,
  deletePost,
  getUserPosts
} = require("../controllers/postControllers");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

/**
 * @GET
 */
router.get("/", getHomePosts);
router.get("/user/:username", getUserPosts);
router.get("/:slug", getSinglePost);
/**
 * @POST
 */
router.post("/", authenticate, createNewPost);

/**
 * @UPDATE
 */
router.put("/:slug", authenticate, updatePost);

/**
 * @DELETE
 */
router.delete("/:slug", authenticate, deletePost);

module.exports = router;
