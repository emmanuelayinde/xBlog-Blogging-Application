const router = require("express").Router();
const {
  getUerDetailsByUsername,
  getUerDetailsById,
  getAllUsers,
  updateProfile,
  updateEmail,
  updatePassword,
  updateUsername,
  followUser,
  unfollowUser,
  getUerDetailsTokenless
} = require("../controllers/userControllers");
const authenticate = require("../middlewares/authenticate");
const {
  update_profile,
  validate,
  update_password,
  email,
  update_username,
} = require("../middlewares/validator");


/**
 * @GET
 */
router.get("/all", getAllUsers);
router.get("/id/:id", authenticate, getUerDetailsById);
router.get("/username/:username", authenticate, getUerDetailsByUsername);
router.get("/username/tl/:username", getUerDetailsTokenless);

/**
 * @POST
 */
router.post("/follow-user", authenticate, followUser);
router.post("/unfollow-user", authenticate, unfollowUser);

/**
 * @UPDATE
 */
router.put("/:id", validate(update_profile), updateProfile);
router.put("/email/:id", validate(email), updateEmail);
router.put("/password/:id", validate(update_password), updatePassword);
router.put("/username/:id", validate(update_username), updateUsername);

module.exports = router;
