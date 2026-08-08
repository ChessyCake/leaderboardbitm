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

    todaySolved: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    lastSubmissionID: {
      type: String,
      default: null,
    },

    lastSubmissionTime: {
      type: Date,
      default: null,
    },

    lastSolvedDay: {
      type: Number,
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