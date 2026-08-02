import mongoose from "mongoose";

const cfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    maxRating: {
      type: Number,
      default: 0,
    },

    rank: {
      type: String,
      default: "",
    },

    maxRank: {
      type: String,
      default: "",
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

   
    lastSolvedDay: {
      type: Number,
      default: null,
    },

    lastSubmissionId: {
      type: Number,
      default: 0,
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

cfSchema.index({ todaySolved: -1 });
cfSchema.index({ totalSolved: -1 });
cfSchema.index({ rating: -1 });
cfSchema.index({ streak: -1 });

export default  mongoose.model("Codeforces", cfSchema);