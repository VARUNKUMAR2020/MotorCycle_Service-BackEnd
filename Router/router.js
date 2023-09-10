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
  usersData,
  addMotor,
  callBack,
  callBackOTP,
} = require("../Controller/apicontroller");

//API Routers
router.route("/").get(home);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verify").post(verifyOTP);
router.route("/changePassword").post(changePassword);
router.route("/userdata").post(usersData);
router.route("/addMotor").post(addMotor);
router.route("/callback").post(callBack);
router.route("/otp").post(callBackOTP)


module.exports = router;
