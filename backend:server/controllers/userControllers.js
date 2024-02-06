const User = require("../models/userModel");
const response = require("../utils/response");
const keys = require("../config");
const bcrypt = require("bcrypt");
const { encrypt } = require("../utils/encryption");
const { signJWT } = require("../utils/jwt");
const connection = require("../utils/connection");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns user details
 */
const getUerDetailsById = async (req, res) => {
  try {
    const userDetails = await User.findOne(
      { _id: req.params.id },
      {
        password: 0,
        __v: 0,
        reset_token: 0,
        reset_token_ttl: 0,
      },
    );
    if (!userDetails) {
      return response(req, res, 404, true, false, "No user profile found");
    }

    return response(
      req,
      res,
      200,
      false,
      {
        ...userDetails._doc,
        connectionLevel: connection(req.body.authorizedUser, userDetails),
      },
      "User details retrieve successfully",
    );
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns user details
 */
const getUerDetailsByUsername = async (req, res) => {
  try {
    const userDetails = await User.findOne(
      { username: req.params.username },
      {
        password: 0,
        __v: 0,
        reset_token: 0,
        reset_token_ttl: 0,
      },
    );
    if (!userDetails) {
      return response(req, res, 404, true, false, "No user profile found");
    }

    return response(
      req,
      res,
      200,
      false,
      {
        ...userDetails._doc,
        connectionLevel: connection(req.body.authorizedUser, userDetails),
      },
      "User details retrieve successfully",
    );
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns user details
 */
const getUerDetailsTokenless = async (req, res) => {
  try {
    const userDetails = await User.findOne(
      { username: req.params.username },
      {
        password: 0,
        __v: 0,
        reset_token: 0,
        reset_token_ttl: 0,
      },
    );
    if (!userDetails) {
      return response(req, res, 404, true, false, "No user profile found");
    }

    return response(
      req,
      res,
      200,
      false,
      userDetails,
      "User details retrieve successfully",
    );
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns list of all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return response(req, res, 200, false, users, "Users retrieve successfully");
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 * Update User Profile
 *
 * @param {*} req
 * @param {*} res
 */
const updateProfile = async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return response(req, res, 404, true, false, "No user found");
    const updatedProfile = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      },
    );

    // Create JWT payload to generate a new token
    const jwt_payload = {
      _id: encrypt(updatedProfile?._id?.toString()),
      name: encrypt(updatedProfile?.name?.toString()),
      username: encrypt(updatedProfile?.username?.toString()),
      email: encrypt(updatedProfile?.email?.toString()),
    };

    // Generate JWT token
    const token = await signJWT(jwt_payload);

    updatedProfile._doc.token = token;
    delete updatedProfile._doc.__v;
    delete updatedProfile._doc.password;
    delete updatedProfile._doc.reset_token;
    delete updatedProfile._doc.reset_token_ttl;

    response(
      req,
      res,
      200,
      false,
      updatedProfile,
      "User profile updated successfully",
    );
  } catch (error) {
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 * Update User Profile
 *
 * @param {*} req
 * @param {*} res
 */
const updateEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return response(req, res, 404, true, false, "No user found");

    const userWithEmail = await User.findOne({ email: req.body.email });
    if (userWithEmail)
      return response(
        req,
        res,
        409,
        true,
        false,
        "There is an account attached with the email",
      );

    const updatedProfile = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      },
    );

    // Create JWT payload to generate a new token
    const jwt_payload = {
      _id: encrypt(updatedProfile?._id?.toString()),
      name: encrypt(updatedProfile?.name?.toString()),
      username: encrypt(updatedProfile?.username?.toString()),
      email: encrypt(updatedProfile?.email?.toString()),
    };

    // Generate JWT token
    const token = await signJWT(jwt_payload);

    updatedProfile._doc.token = token;
    delete updatedProfile._doc.__v;
    delete updatedProfile._doc.password;
    delete updatedProfile._doc.reset_token;
    delete updatedProfile._doc.reset_token_ttl;

    response(
      req,
      res,
      200,
      false,
      updatedProfile,
      "User email updated successfully",
    );
  } catch (error) {
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 * Updae user password
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updatePassword = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return response(req, res, 404, true, false, "No user foundk");

    // Hashed user password
    const salt = bcrypt.genSaltSync(Number(keys.SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        new: true,
      },
    );

    response(req, res, 200, false, {}, "Password updated successfully");
  } catch (error) {
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 * Update User Profile
 *
 * @param {*} req
 * @param {*} res
 */
const updateUsername = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return response(req, res, 404, true, false, "No user found");

    const userWithUsername = await User.findOne({
      username: req.body.username,
    });
    if (userWithUsername)
      return response(req, res, 409, true, false, "Username exist");

    const updatedProfile = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      },
    );

    // Create JWT payload to generate a new token
    const jwt_payload = {
      _id: encrypt(updatedProfile?._id?.toString()),
      name: encrypt(updatedProfile?.name?.toString()),
      username: encrypt(updatedProfile?.username?.toString()),
      email: encrypt(updatedProfile?.email?.toString()),
    };

    // Generate JWT token
    const token = await signJWT(jwt_payload);

    updatedProfile._doc.token = token;
    delete updatedProfile._doc.__v;
    delete updatedProfile._doc.password;
    delete updatedProfile._doc.reset_token;
    delete updatedProfile._doc.reset_token_ttl;

    response(
      req,
      res,
      200,
      false,
      updatedProfile,
      "Username updated successfully",
    );
  } catch (error) {
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 * Follow user
 *
 * @param {*} req
 * @param {*} res
 */
const followUser = async (req, res) => {
  try {
    const followingUserExist = await User.findOne({
      _id: req.body.following_id,
    });
    if (!followingUserExist)
      return response(
        req,
        res,
        404,
        true,
        false,
        "The user you are trying to follow does not exit",
      );

    // Update follower profile
    const followerUser = await User.findOneAndUpdate(
      { _id: req.body.authorizedUser._id },
      {
        $push: {
          following: req.body.following_id,
        },
      },
      {
        new: true,
      },
    );

    // Update following profile
    const followingUser = await User.findOneAndUpdate(
      { _id: req.body.following_id },
      {
        $push: {
          followers: req.body.authorizedUser._id,
        },
      },
      {
        new: true,
      },
    );

    response(
      req,
      res,
      200,
      false,
      {
        myFollowing: followerUser._doc.following,
        userFollowers: followingUser._doc.followers,
        connectionLevel: connection(req.body.authorizedUser, followingUser),
      },
      `You are now following ${followingUser.username}`,
    );
  } catch (error) {
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 * Unfollow user
 *
 * @param {*} req
 * @param {*} res
 */
const unfollowUser = async (req, res) => {
  try {
    const followingUserExist = await User.findOne({
      _id: req.body.following_id,
    });
    if (!followingUserExist)
      return response(
        req,
        res,
        404,
        true,
        false,
        "The user you are trying to unfollow does not exit",
      );

    // Update follower profile
    const followerUser = await User.findOneAndUpdate(
      { _id: req.body.authorizedUser._id },
      {
        $pull: {
          following: req.body.following_id,
        },
      },
      {
        new: true,
      },
    );

    // Update following profile
    const followingUser = await User.findOneAndUpdate(
      { _id: req.body.following_id },
      {
        $pull: {
          followers: req.body.authorizedUser._id,
        },
      },
      {
        new: true,
      },
    );

    response(
      req,
      res,
      200,
      false,
      {
        myFollowing: followerUser._doc.following,
        userFollowers: followingUser._doc.followers,
        connectionLevel: connection(req.body.authorizedUser, followingUser),
      },

      `You just unfollow ${followingUser.username}`,
    );
  } catch (error) {
    return response(req, res, 500, true, false, error.message);
  }
};

module.exports = {
  getUerDetailsById,
  getUerDetailsByUsername,
  getUerDetailsTokenless,
  getAllUsers,
  updateEmail,
  updateProfile,
  updatePassword,
  updateUsername,
  followUser,
  unfollowUser,
};
