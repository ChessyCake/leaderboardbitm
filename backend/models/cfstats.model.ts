import mongoose from "mongoose";

const cfSchema = new mongoose.Schema(
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


export default  mongoose.model("Codeforces", cfSchema);