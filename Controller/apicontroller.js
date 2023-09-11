const User = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Motor = require("../Model/Motor");
const Query = require("../Model/Query");

const JWT_SECRET = "nkdgyuacfauwlVGXfwtydjuujPQdxWCHYUGYU";

//Declarating OTP variable globally
let OTP;

//Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "v.varunvenkat06081998@gmail.com",
    pass: "yonpdfpheczokktp",
  },
});

//Home Address of the server :-
exports.home = (req, res) => {
  res.send("Server is Ready and It is in Home Page");
};

//Register the Data in the Database :-
exports.register = async (req, res) => {
  const { firstName, lastName, gender, dob, email, password, mobile } =
    req.body;
  const existingUser = await User.findOne({ email });
  try {
    if (existingUser) {
      res.status(200).json({ status: false, message: "User Exits !!" });
    } else {
      const token = jwt.sign({ email: email }, JWT_SECRET);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.create({
        firstName,
        lastName,
        gender,
        dob,
        email,
        password: encryptedPassword,
        mobile,
      });
      res
        .status(200)
        .json({ status: true, message: "Created SuccessFully", data: token });
    }
  } catch (error) {
    res.status(404).json({ message: "404 Page Not Found" });
  }
};

//Login of user :-
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  try {
    if (!existingUser) {
      res.status(200).json({ status: false, message: "Please Register" });
    } else {
      if (bcrypt.compare(password, existingUser.password)) {
        const token = jwt.sign({ email: existingUser.email }, JWT_SECRET);
        res.json({
          status: true,
          message: "Logged in SuccessFully",
          data: token,
        });
      } else {
        res
          .status(401)
          .json({ status: false, message: "Please Check the Credentials" });
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
  OTP = Math.floor(1000 + Math.random() * 9000);
  const existingUser = await User.findOne({ email });
  try {
    if (existingUser) {
      const mailOption = {
        from: "v.varunvenkat06081998@gmail.com",
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
            <h3>Hi ${existingUser.firstName},</h3> 
              <h3>You can Reset Your Password using Below OTP</h3>
            <h1>${OTP}</h1>
            <h3>Happy Motoring :) Royal Enfield-Team</h3>
               <img src="https://www.royalenfield.com/content/dam/re-platform-images/dropDown-ourWorld/Dropdown---Our-World---Trip-stories.jpg"  />
              
            </div>
        </body>
        </html>`,
      };

      transporter.sendMail(mailOption, (err) => {
        if (!err) {
          res.cookie("token", token).json({
            status: true,
            message: "OTP Sended SuccessFully",
            data: token,
          });
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

// Reset the Password :-
exports.changePassword = async (req, res) => {
  const { password, confirmPassword, token } = req.body;
  const userEmail = jwt.verify(token, JWT_SECRET);
  const email = userEmail.email;
  try {
    if (password === confirmPassword) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        { email: email },
        { $set: { password: encryptedPassword } }
      );
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

//Motor data of the user:-
exports.usersData = async (req, res) => {
  const { token } = req.body;
  const userEmail = jwt.verify(token, JWT_SECRET);
  const email = userEmail.email;
  const motor = await Motor.findOne({ email: email });
  const user = await User.findOne({ email });
  console.log(email);
  try {
    if (!motor) {
      res.status(200).json({
        message: `Hii ${user.firstName}`,
        name: user.firstName,
        mail: email,
      });
    } else {
      res.status(200).json({
        message: `Hii ${user.firstName}`,
        name: user.firstName,
        mail: email,
        data: motor.service,
      });
    }
  } catch (error) {
    res.status(404).json({ message: "error" });
  }
};

//Add Vehicle:-
exports.addMotor = async (req, res) => {
  const { token, RegNum } = req.body;
  const userEmail = jwt.verify(token, JWT_SECRET);
  const email = userEmail.email;
  const existingUser = await Motor.findOne({ email: email });
  const name = await User.findOne({ email: email });
  const userName = name.firstName;
  try {
    if (!RegNum) {
      return res.status(200).json({ message: "Please enter Register NUmber" });
    } else if (!existingUser) {
      await Motor.create({
        email: email,
        name: userName,
        service: [{ reg_no: RegNum, status: "Ongoing" }],
      });
      res.status(200).json({
        message: `${userName} your New vehicle added`,
        data: existingUser.service,
      });
    } else {
      await Motor.updateOne({
        email: email,
        $push: { service: [{ reg_no: RegNum, status: "Ongoing" }] },
      });
      res.json({
        message: `${userName} , Existing added another vehicle`,
        data: existingUser.service,
      });
    }
  } catch (error) {
    res.status(404).json({ messag: error });
  }
};

//Service-call - OTP :-
exports.callBackOTP = async (req, res) => {
  const { name, mail } = req.body;
  OTP = Math.floor(1000 + Math.random() * 9000);
  try {
    if (!name && !mail) {
      return res.json({ status: false, message: "Fill the Details" });
    }
    const mailOption = {
      from: "v.varunvenkat06081998@gmail.com",
      to: mail,
      subject: `Welcome ${name} - From Royal EnField Team  `,
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div>
        <h3>Hi ${name},</h3> 
          <h3>Your OTP : ${OTP}</h3>
           <img src="https://www.royalenfield.com/content/dam/royal-enfield/india/locate-us/landing/service-centre.jpg"  />
           <h3>Happy Motoring :) Royal Enfield-Team</h3>
        </div>
    </body>
    </html>`,
    };

    transporter.sendMail(mailOption, (err) => {
      if (!err) {
        res.status(200).json({
          status: true,
          message: "We Sent OTP to your Mail-ID",
        });
      } else {
        res
          .status(200)
          .json({ status: false, message: "Something Went wrong" });
      }
    });
  } catch (error) {
    res.status(404).json({ message: "Page not Found" });
  }
};

// Service-call :-
exports.callBack = async (req, res) => {
  const { name, mobile, UserOTP, mail } = req.body;
  try {
    if (!name && !mobile && !mail) {
      return res.json({ status: false, message: "Fill the Details" });
    }
    if (UserOTP == OTP) {
      const mailOption = {
        from: "v.varunvenkat06081998@gmail.com",
        to: mail,
        subject: `Welcome ${name} - From Royal EnField Team  `,
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <div>
          <h3>Hi ${name},</h3> 
            <h3>We are glad to help you , Our chief Service Advisor will reach you in a short time on your number - ${mobile}</h3>
             <img src="https://www.royalenfield.com/content/dam/royal-enfield/india/home/locate-us/leh-rider.jpg"  />
             <h3>Happy Motoring :) Royal Enfield-Team</h3>
          </div>
      </body>
      </html>`,
      };

      transporter.sendMail(mailOption, (err) => {
        if (!err) {
          res.status(200).json({
            status: true,
            message: "You will be reachout by our RE-Team soon",
          });
        } else {
          res
            .status(200)
            .json({ status: false, message: "Something Went wrong" });
        }
      });
    } else {
      res.status(200).json({ status: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(404).json({ message: "Page not Found" });
  }
};

// Service History Details :-
exports.serviceHistory = async (req, res) => {
  const { token } = req.body;
  const { email } = jwt.verify(token, JWT_SECRET);
  const existingUser = await Motor.findOne({ email: email });
  try {
    if (!token) {
      return res.json({ status: false, message: "Please Login" });
    }
    if (!existingUser) {
      res.status(200).json({ status: false, message: "Please Login" });
    } else {
      res.status(200).json({
        status: true,
        message: "Your's Service Details",
        data: existingUser.service,
        name: existingUser.name,
      });
    }
  } catch (error) {}
};

//Help Service :-
exports.helpService = async (req, res) => {
  const { UserOTP, name, mobile, mail, query } = req.body;
  try {
    if (!name && !mobile && !mail && !query) {
      return res.json({ status: false, message: "Fill the Details" });
    }
    if (UserOTP == OTP) {
      await Query.create({
        name: name,
        mobile: mobile,
        mail: mail,
        query: query,
      });
      const mailOption = {
        from: "v.varunvenkat06081998@gmail.com",
        to: mail,
        subject: `Welcome ${name} - From Royal EnField Team  `,
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <div>
          <h3>Hi ${name},</h3> 
            <h3>We are glad to help you , Our chief Service Advisor will reach you in a short time on your number - ${mobile}</h3>
             <img src="https://www.royalenfield.com/content/dam/royal-enfield/india/home/locate-us/leh-rider.jpg"  />
             <h4>Happy Motoring :) Royal Enfield-Team</h4>
          </div>
      </body>
      </html>`,
      };

      transporter.sendMail(mailOption, (err) => {
        if (!err) {
          res.status(200).json({
            status: true,
            message: "You Query is Stored - We will reach out soon",
          });
        } else {
          res
            .status(200)
            .json({ status: false, message: "Something Went wrong" });
        }
      });
    } else {
      res.status(200).json({ status: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(404).json({ message: "Page not Found" });
  }
};

//Rides update :-
exports.ridesUpdate = async (req, res) => {
  const { name, mail, pincode, term } = req.body;
  try {
    if (name && mail && pincode && term) {
      const mailOption = {
        from: "v.varunvenkat06081998@gmail.com",
        to: mail,
        subject: `Welcome ${name} - From Royal EnField Team  `,
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <div>
          <h3>Hi ${name},</h3> 
            <h3>We will Ride soon ${name}, we will intimate when we ride on your Area pincode ${pincode}. Mail on your mailID- ${mail}</h3>
             <img src="https://www.royalenfield.com/content/dam/royal-enfield/india/home/locate-us/leh-rider.jpg"  />
             <h4>Happy Motoring :) Royal Enfield-Team</h4>
          </div>
      </body>
      </html>`,
      };
      transporter.sendMail(mailOption, (err) => {
        if (!err) {
          res.status(200).json({
            status: true,
            message: "Check you Mail - We will Ride Soon",
          });
        } else {
          res
            .status(200)
            .json({ status: false, message: "Something Went wrong" });
        }
      });
    } else {
      res.json({ status: false, message: "Please Fill the Details" });
    }
  } catch (error) {
    res.status(404).json({ message: "Error", error });
  }
};
