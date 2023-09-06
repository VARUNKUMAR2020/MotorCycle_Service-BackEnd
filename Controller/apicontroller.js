const User = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const JWT_SECRET = "nkdgyuacfauwlVGXfwtydjuujPQdxWCHYUGYU";

//Declarating OTP variable globally
let OTP;

//Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//Home Address of the server :-
exports.home = (req, res) => {
  res.cookie("name", "varun");
  res.send("Server is Ready and It is in Home Page");
};

//Register the Data in the Database :-
exports.register = async (req, res) => {
  const { firstName, lastName, gender, dob, email, password, mobile } =
    req.body;
  //encryption of password
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(200).json({ status: false, message: "User Exits !!" });
    } else {
      await User.create({
        firstName,
        lastName,
        gender,
        dob,
        email,
        password: encryptedPassword,
        mobile,
      });
      res.status(201).json({ status: true, message: "Created SuccessFully" });
    }
  } catch (error) {
    res.status(400).json({ message: "404 Page Not Found" });
  }
};

//Login of user :-
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  try {
    if (!existingUser) {
      res.status(201).json({ status: "false", message: "Please Register" });
    } else {
      if (bcrypt.compare(password, existingUser.password)) {
        const token = jwt.sign({ email: existingUser.email }, JWT_SECRET);
        res.status(200).json({
          status: "true",
          message: "Logged in SuccessFully",
          data: token,
        });
      } else {
        res.status(401).json({ message: "Please Check the Credentials" });
      }
    }
  } catch (error) {
    res.status(404).json({ message: "404 Page Not Found" });
  }
};

//Forgot-Password -- Sending the OTP:-
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email: email }, JWT_SECRET);
  OTP = Math.floor(Math.random() * 9999);
  const existingUser = await User.findOne({ email });
  try {
    if (existingUser) {
      const mailOption = {
        from: process.env.EMAIL_USER,
        to: existingUser.email,
        subject: `Welcome From Royal EnField Team - ${existingUser.firstName} `,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <div>
            <h4>Hi ${existingUser.firstName},</h4> 
              <h5>You can Reset Your Password using Below OTP</h5>
            <h1>${OTP}</h1>
            <h4>Happy Motoring :) Royal Enfield-Team</h4>
               <img src="https://www.royalenfield.com/content/dam/re-platform-images/dropDown-ourWorld/Dropdown---Our-World---Trip-stories.jpg"  />
              
            </div>
        </body>
        </html>`,
      };

      transporter.sendMail(mailOption, (err) => {
        if (!err) {
          res.cookie("token", token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true,
          });
          res
            .status(200)
            .json({ status: true, message: "OTP Sended SuccessFully" });
        } else {
          res
            .status(205)
            .json({ status: false, message: "Error in Sending OTP" });
        }
      });
    } else {
      res.json({ status: false, message: "Please Register" });
    }
  } catch (error) {
    res.status(404).json({ message: "404 Page Not Found" });
  }
};

//Verifying the OTP :-
exports.verifyOTP = async (req, res) => {
  const { UserOTP } = req.body;
  try {
    if (UserOTP == OTP) {
      res.status(200).json({ status: true, message: "OTP is Verified" });
    } else {
      res.status(200).json({ status: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(404).json({ message: "404 Page not Found" });
  }
};

// Changing the Password :-
exports.changePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.cookie;
  const email = jwt.verify(token.email, jwt);
  try {
    if (password === confirmPassword) {
      const user = await User.findOne({ email });
      user.password = confirmPassword;
      res
        .status(200)
        .json({ status: true, message: "Password Changed successfully" });
    } else {
      res.status(200).json({
        status: false,
        message: "Password and Confirm Password Should be same",
      });
    }
  } catch (error) {
    res.status(404).json({ messag: "404 Page not Found" });
  }
};
