import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

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

transporter.sendMail(
  {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Test Email",
    text: "This is a test email.",
  },
  (err, info) => {
    if (err) {
      console.log("ERROR:", err);
    } else {
      console.log("SUCCESS:", info.response);
    }
  }
);