const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER
// ======================================================

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check password
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        message: "Password must be between 6 and 20 characters",
      });
    }

    // Check email
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires in 15 minutes
    const otpExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Send OTP email
    await sendMail({
      email: user.email,
      subject: "ConvertBot - Email Verification OTP",
      message: `Your ConvertBot verification OTP is ${otp}. This OTP is valid for 15 minutes.`,
    });

    return res.status(201).json({
      message: "Registration successful. OTP sent to your email.",
    });

  } catch (error) {
    console.log("Register Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// ======================================================
// VERIFY OTP
// ======================================================

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check fields
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Mark user as verified
    user.isVerified = true;

    // Remove OTP
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // IMPORTANT:
    // Return user information also
    return res.status(200).json({
      message: "Email verified successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Verify OTP Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check verification
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }

    // Compare password
    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Return token + user
    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};