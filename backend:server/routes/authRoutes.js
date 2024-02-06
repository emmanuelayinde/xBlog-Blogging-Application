const router = require("express").Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  checkUsername,
} = require("../controllers/authControllers");
const {
  register,
  validate,
  login,
  forget_password,
  reset_password,
} = require("../middlewares/validator");
// const passportGoogle = require("../services/passportGoogle");
// const passportGithub = require("../services/passportGithub");

/**
 * @GET
 */
// router.get("/google", passportGoogle.authenticate("google"));
// router.get("/github", passportGithub.authenticate("github"));

/**
 * @POST
 */
router.post("/register", validate(register), registerUser);
router.post("/username", checkUsername)
router.post("/login", validate(login), loginUser);
router.post("/forget-password", validate(forget_password), forgotPassword);
router.post("/reset-password/:resetToken", validate(reset_password), resetPassword);

module.exports = router;
