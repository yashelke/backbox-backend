import express from "express";
import {newUser , loginUser, requestOTP, verifyOTP} from "../controllers/userContoller.js";

const router =express.Router();


router.post("/signup",newUser);
router.post("/login",loginUser);

// OTP Authentication Routes
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

export default router;

