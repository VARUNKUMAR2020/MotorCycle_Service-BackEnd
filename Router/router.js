const express = require("express");
const router = express.Router();
const {
  home,
  register,
  login,
  forgotPassword,
  verifyOTP,
  changePassword,
  test,
} = require("../Controller/apicontroller");

//API Routers
router.route("/").get(home);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verify").post(verifyOTP);
router.route("/changePassword").post(changePassword);



module.exports = router;
