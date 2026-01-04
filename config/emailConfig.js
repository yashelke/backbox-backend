import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like outlook, yahoo, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send OTP email
export const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Login - JWT & OTP Authentication',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 50px auto;
                            background: white;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .content {
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .otp-box {
                            background: #f7fafc;
                            border: 2px solid #667eea;
                            border-radius: 10px;
                            padding: 20px;
                            margin: 30px 0;
                            font-size: 32px;
                            font-weight: bold;
                            color: #667eea;
                            letter-spacing: 8px;
                        }
                        .footer {
                            background: #f7fafc;
                            padding: 20px;
                            text-align: center;
                            color: #718096;
                            font-size: 14px;
                        }
                        .warning {
                            color: #dc2626;
                            font-size: 14px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 OTP Verification</h1>
                        </div>
                        <div class="content">
                            <h2>Your One-Time Password</h2>
                            <p>Use the following OTP to login to your account:</p>
                            <div class="otp-box">${otp}</div>
                            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                            <p class="warning">⚠️ Never share this OTP with anyone. Our team will never ask for your OTP.</p>
                        </div>
                        <div class="footer">
                            <p>If you didn't request this OTP, please ignore this email.</p>
                            <p>&copy; ${new Date().getFullYear()} JWT & OTP Authentication. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

export default transporter;
