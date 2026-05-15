const user = require("../models/user");
const otpGenerator = require("otp-generator");
const { raw } = require("express");
const OTP = require("../models/OTP");
const profile = require("../models/profile");
const mailSender = require("../utils/nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//Send OTP MODEL

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body; // jo bhi schema hai vo db banna ke liye use hota hai.

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    //chceking if this user already exists.?

    //findone syntax .findone({email (//ye schema mai jo email likha tha vo hai ): user_email // email ki value hai mtlb user typed email })

    const check_user = await user.findOne({ email }); // user is the model jo ki db se baat krr rha hai so we are querying the db to check

    if (check_user) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    var generated_otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // check unique otp
    let result = await OTP.findOne({ otp: generated_otp });

    while (result) {
      generated_otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: generated_otp });
    }
    // Step 4: At this point, otp is guaranteed unique
    console.log("Unique OTP:", generated_otp);

    const otp_payload = { email, otp : generated_otp };

    const otp_body = await OTP.create(otp_payload);
    console.log(otp_body);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "There is some failure",
    });
  }
};

// sign up model

exports.signUp = async (req, res) => {
  //fetch data

  try {
    const {
      firstName,
      lastName,
      email,
      contactnumber,
      password,
      confirmpassword,
      acctype,
      otp,
    } = req.body;

    //check required fields

    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactnumber ||
      !password ||
      !confirmpassword ||
      !acctype ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // validate passwords

    if (password !== confirmpassword) {
      return res.status(403).json({
        success: false,
        message: "Password and confirmpassword does not match",
      });
    }

    // check user existence

    const check_user = await user.findOne({ email }); // user is the model jo ki db se baat krr rha hai so we are querying the db to check

    if (check_user) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // find most recent OTP

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP NOT FOUND.",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP does not match.",
      });
    }

    // hashing password

    const hashed_password = await bcrypt.hash(password, 10);

    //create entry of user in DB

    const profileDetails = await profile.create({
      gender: null,
      dateofbirth: null,
      contactnumber: null,
      about: null,
    });

    const user_entry = await user.create({
      firstName,
      lastName,
      email,
      contactnumber,
      password: hashed_password,
      acctype,
      otp,
      additionaldetails: profileDetails._id,
      image:
        `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "User cannot be registered..",
    });
  }
};

// login flow model

exports.login = async (req, res) => {
  try {
    //Fecth details

    const { email, password } = req.body;

    // password matching

    if (!email || !password) {
      res.status(403).json({
        success: false,
        message: "All fields Required",
      });
    }

    const user_exist = await user
      .findOne({ email })
      .populate("additionaldetails");

    if (!user_exist) {
      res.status(403).json({
        success: false,
        message: "User cannot be found",
      });
    }

    if (await bcrypt.compare(password, user_exist.password)) {
      const payload = {
        email: user_exist.email,
        id: user_exist._id,
        role: user_exist.acctype,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      // user_exist = user_exist.toObject();
      user_exist.token = token;
      user_exist.password = undefined;

      // create cookie and send ..

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user_exist,
        message: "Logged IN successfully.",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "User cannot be registered..",
    });
  }
};

// change password model

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required.",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const userFind = await User.findOne({ email });

    if (!userFind) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, userFind.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userFind.password = hashedPassword;
    await userFind.save();

    // 📧 Send confirmation email
    try {
      await mailSender(
        userFind.email,
        "Password Updated Successfully",
        `<h2>Hello ${userFind.firstName},</h2>
         <p>Your password has been changed successfully.</p>
         <p>If you did not perform this action, please contact support immediately.</p>
         <br/>
         <p>— Team StudyNotion</p>`,
      );
    } catch (emailError) {
      console.log("Email send failed:", emailError);
      // Don't fail the whole request just because email failed
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Password cannot be changed",
    });
  }
};
