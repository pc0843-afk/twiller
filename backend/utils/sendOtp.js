import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("SENDOTP EMAIL:", process.env.EMAIL);
console.log("SENDOTP PASSWORD:", !!process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOtp = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your Login OTP",
    html: `
      <h2>Login Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};