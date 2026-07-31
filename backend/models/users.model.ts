import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        googleID:{
            type: String,
            required: true,
            unique: true
        },
        name:{
            type: String,
            required: true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        avatar:{
            type:String
        },
        leetcode_username:{
            type: String,
            default: "",
        },
        codeforces_username:{
            type: String,
            default: ""
        },

        onboarded: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User