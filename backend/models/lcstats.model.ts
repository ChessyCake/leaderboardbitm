import mongoose from "mongoose";

const leetcodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    totalSolved: {
      type: Number,
      default: 0,
    },

    easySolved: {
      type: Number,
      default: 0,
    },

    mediumSolved: {
      type: Number,
      default: 0,
    },

    hardSolved: {
      type: Number,
      default: 0,
    },

    todaySolved: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    contestRating: {
      type: Number,
      default: 0,
    },

    contestRanking: {
      type: Number,
      default: 0,
    },

    lastSubmissionTime: {
      type: Date,
      default: null,
    },

    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LeetCode", leetcodeSchema);