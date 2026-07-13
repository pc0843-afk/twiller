import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendPassword = async (email, password) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Twiller Password Reset",

    html: `
      <h2>Password Reset</h2>

      <p>Your generated password is:</p>

      <h1>${password}</h1>

      <p>Please use this password to log in.</p>
    `,
  });
};