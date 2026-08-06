import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema(
    {
        date: {
            type: Number,
            required: true,
            unique: true, 
        },
        top_users: {
            type: [Object],
            default: [],
        },
        total_online: {
            type: Number,
            default: 0,
        },
        total_solved: {
            type: Number,
            default: 0,
        },
        total_LCsolved: {
            type: Number,
            default: 0,
        },
        total_CFsolved: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Archive", archiveSchema);