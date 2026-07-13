import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  browser: {
    type: String,
  },

  os: {
    type: String,
  },

  device: {
    type: String,
  },

  ip: {
    type: String,
  },

  loginTime: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LoginHistory", LoginHistorySchema);