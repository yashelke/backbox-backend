import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'Backbox OTP <onboarding@resend.dev>';

// Function to send OTP email
export const sendOTPEmail = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM,
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
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            return { success: false, error: error.message };
        }

        console.log('Email sent successfully:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

export default resend;
