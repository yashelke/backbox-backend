import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../config/emailConfig.js";


// SignUp Function

const newUser = async (req , res) =>
{
   try{
     const existingUser = await User.findOne({email:req.body.email});
    if(existingUser)
    {
        return res.status(400).json({message:"User already exists."});
    }
    
    // Validate password length
    if(req.body.password.length <6)
    {
      return res.status(400).json({message:"Password must be at least 6 characters long."});
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);

    const registerUser = await User.create({
        email:req.body.email,
        password:hashedPassword
    })
    const { password, ...userWithoutPassword } = registerUser.toObject();
    res.status(201).json({message:"User registered successfully",user:userWithoutPassword} );

   }
   catch(error)
   {
    res.status(500).json({message:"Server Error: ",error: error.message});
   }
}




// Login Function


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // 2️⃣ Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 4️⃣ Remove password from response
    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    // 5️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// Password Reset Functionality will be implemented later


// ============================================
// OTP AUTHENTICATION FUNCTIONS
// ============================================

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP - Send OTP to user's email
const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // 2️⃣ Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email. Please sign up first." });
    }

    // 3️⃣ Generate OTP
    const otp = generateOTP();
    
    // 4️⃣ Set OTP expiry (10 minutes from now)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // 5️⃣ Save OTP and expiry to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // 6️⃣ Send OTP via email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

    // 7️⃣ Send success response
    res.status(200).json({
      message: "OTP sent successfully to your email.",
      email: email
    });

  } catch (error) {
    console.error("Error in requestOTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Verify OTP and Login User
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    // 3️⃣ Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({ message: "No OTP requested. Please request OTP first." });
    }

    // 4️⃣ Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      // Clear expired OTP
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    // 5️⃣ Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // 6️⃣ OTP is valid - Clear OTP from database
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // 7️⃣ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 8️⃣ Remove password from response
    const { password, otp: userOtp, otpExpiry, ...userWithoutSensitiveData } = user.toObject();

    // 9️⃣ Send success response
    res.status(200).json({
      message: "OTP verified successfully. Login successful!",
      user: userWithoutSensitiveData,
      token
    });

  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export { newUser, loginUser, requestOTP, verifyOTP };