import dotenv from "dotenv";
dotenv.config();

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import mongoose from "mongoose";

import User from "./models/user.js";
import Tweet from "./models/tweet.js";
import LoginHistory from "./models/LoginHistory.js";
import Otp from "./models/Otp.js";
import Payment from "./models/Payment.js";

import razorpay from "./utils/razorpay.js";

import { sendOtp } from "./utils/sendOtp.js";
import { sendPassword } from "./utils/sendPassword.js";
console.log("KEY ID =", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET =", process.env.RAZORPAY_KEY_SECRET);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Twiller backend is running successfully");
});

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONOGDB_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

  // Register User
app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(200).send(existingUser);
    }

    const newUser = new User(req.body);

    await newUser.save();

    return res.status(201).send(newUser);

  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Logged In User
app.get("/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send({
        error: "Email required",
      });
    }

    const user = await User.findOne({ email });

    return res.status(200).send(user);

  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Update Profile
app.patch("/userupdate/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: req.body },
      {
        new: true,
        upsert: false,
      }
    );

    return res.status(200).send(updatedUser);

  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Create Tweet
app.post("/post", async (req, res) => {
  try {

    const user = await User.findById(req.body.author);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const today = new Date().toDateString();

    if (new Date(user.lastTweetDate).toDateString() !== today) {
      user.tweetsToday = 0;
      user.lastTweetDate = new Date();
    }

    if (
      user.subscription !== "Gold" &&
      user.tweetsToday >= user.tweetLimit
    ) {
      return res.status(400).send({
        message: `Your ${user.subscription} plan allows only ${user.tweetLimit} tweet(s). Please upgrade your plan.`,
      });
    }

    const tweet = new Tweet(req.body);

    await tweet.save();

    user.tweetsToday += 1;
    await user.save();

    return res.status(201).send(tweet);

  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Get All Tweets
app.get("/post", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ timestamp: -1 })
      .populate("author");

    return res.status(200).send(tweets);
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Like Tweet
app.post("/like/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;

    const tweet = await Tweet.findById(req.params.tweetid);

    if (!tweet.likedBy.includes(userId)) {
      tweet.likes += 1;
      tweet.likedBy.push(userId);

      await tweet.save();
    }

    res.send(tweet);
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Retweet
app.post("/retweet/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;

    const tweet = await Tweet.findById(req.params.tweetid);

    if (!tweet.retweetedBy.includes(userId)) {
      tweet.retweets += 1;
      tweet.retweetedBy.push(userId);

      await tweet.save();
    }

    res.send(tweet);
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (user.lastPasswordReset) {
      const diff =
        Date.now() - new Date(user.lastPasswordReset).getTime();

      const oneDay = 24 * 60 * 60 * 1000;

      if (diff < oneDay) {
        return res.status(400).send({
          message:
            "You can use this option only one time per day.",
        });
      }
    }

   user.lastPasswordReset = new Date();

await user.save();

const letters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

let generatedPassword = "";

for (let i = 0; i < 10; i++) {
  generatedPassword += letters.charAt(
    Math.floor(Math.random() * letters.length)
  );
}

await sendPassword(email, generatedPassword);

return res.status(200).send({
  message: "Password reset request accepted",
  password: generatedPassword,
});
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// Save Login History
app.post("/login-history", async (req, res) => {
  try {
    const { user, browser, os, device, ip } = req.body;

    const history = new LoginHistory({
      user,
      browser,
      os,
      device,
      ip,
    });

    await history.save();

    res.status(201).send({
      message: "Login history saved successfully",
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// Get Login History
app.get("/login-history/:userId", async (req, res) => {
  try {
    const history = await LoginHistory.find({
      user: req.params.userId,
    }).sort({ loginTime: -1 });

    res.status(200).send(history);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// Send OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
    });

    await sendOtp(email, otp);

    res.send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email,
      otp,
    });

    if (!record) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    await Otp.deleteMany({ email });

    res.send({
        success: true,
        message: "OTP Verified",
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Upgrade Subscription
app.post("/upgrade-subscription", async (req, res) => {
  try {
    const { email, plan } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    user.subscription = plan;

    if (plan === "Free") {
      user.tweetLimit = 1;
    } else if (plan === "Bronze") {
      user.tweetLimit = 3;
    } else if (plan === "Silver") {
      user.tweetLimit = 5;
    } else if (plan === "Gold") {
  user.tweetLimit = Number.MAX_SAFE_INTEGER;
}

    await user.save();

    res.send({
      success: true,
      message: `${plan} plan activated successfully`,
      user,
    });

  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    
    const { amount } = req.body;

// Allow payments only between 10 AM and 11 AM IST
const now = new Date();

const indiaTime = new Date(
  now.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  })
);

const hour = indiaTime.getHours();

if (hour < 10 || hour >= 11) {
  return res.status(400).send({
    success: false,
    message:
      "Payments are allowed only between 10:00 AM and 11:00 AM IST.",
  });
}
    const options = {
      amount: amount * 100, // ₹100 -> 10000 paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.send(order);

  } catch (error) {
  console.log("========== RAZORPAY ERROR ==========");
  console.dir(error, { depth: null });
  console.log("====================================");

  res.status(500).json({
    success: false,
    error,
  });
}
});

// Save Payment
app.post("/save-payment", async (req, res) => {
  try {
    const {
      email,
      plan,
      amount,
      paymentId,
      orderId,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const payment = new Payment({
      user: user._id,
      email,
      plan,
      amount,
      paymentId,
      orderId,
      status: "Success",
    });

    await payment.save();

    res.send({
      success: true,
      message: "Payment Saved Successfully",
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Get Payment History
app.get("/payment-history/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const payments = await Payment.find({ email })
      .sort({ createdAt: -1 });

    res.send(payments);

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Send Invoice
app.post("/send-invoice", async (req, res) => {

  try {

    const { email, plan, amount } = req.body;

    const invoiceNumber =
      "INV-" + Date.now();

    await transporter.sendMail({

      from: process.env.EMAIL,

      to: email,

      subject:
        "Twiller Premium Subscription Invoice",

      html: `

      <h2>Payment Successful 🎉</h2>

      <p>Hello,</p>

      <p>Your subscription has been activated successfully.</p>

      <hr>

      <h3>Invoice</h3>

      <p><strong>Invoice No:</strong> ${invoiceNumber}</p>

      <p><strong>Plan:</strong> ${plan}</p>

      <p><strong>Amount:</strong> ₹${amount}</p>

      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

      <hr>

      <p>
      Thank you for choosing
      <b>Twiller Premium</b>.
      </p>

      `

    });

    res.send({

      success:true,

      message:"Invoice Sent Successfully"

    });

  }

  catch(error){

    res.status(500).send({

      success:false,

      message:error.message

    });

  }

});