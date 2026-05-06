const crypto = require("crypto");
const user = require("../models/user");
const mailSender = require("../utils/nodemailer");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2. Check user exists
    const user_reset_exists = await user.findOne({ email });
    if (!user_reset_exists) {
      return res.status(404).json({
        success: false,
        message: "Email not registered with us",
      });
    }

    // 3. Generate a unique random token
    const token = crypto.randomUUID();

    // 4. Save token + expiry on user (5 mins from now)
    user_reset_exists.token = token;
    user_reset_exists.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user_reset_exists.save();

    // 5. Build the reset URL (frontend route that handles the form)
    const resetUrl = `http://localhost:3000/update-password/${token}`;

    // 6. Send email
    await mailSender(
      email,
      "Reset Your Password",
      `<h2>Hello ${user_reset_exists.firstName},</h2>
       <p>You requested a password reset. Click the link below to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>
       <p>This link expires in 5 minutes.</p>
       <p>If you didn't request this, ignore this email.</p>`
    );

    return res.status(200).json({
      success: true,
      message: "Reset email sent successfully. Check your inbox.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset email",
    });
  }
};


//

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // 1. Validate inputs
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 2. Find user by token
    const user = await user.findOne({ token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 3. Check token hasn't expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new reset link.",
      });
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Update password and clear token (so link can't be reused)
    user.password = hashedPassword;
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};