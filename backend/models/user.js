import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  lastPasswordReset: {
    type: Date,
    default: null,
  },

  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },

  notifications: {
    type: Boolean,
    default: true,
  },

 subscription: {
  type: String,
  default: "Free",
},

tweetLimit: {
  type: Number,
  default: 1,
},

tweetsToday: {
  type: Number,
  default: 0,
},

lastTweetDate: {
  type: Date,
  default: Date.now,
},

joinedDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);