import mongoose from "mongoose";

const cflbschema = new mongoose.Schema(
    {
        id:{
            type: Number,
            unique: true
        },
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Users"
        }
    }
)

export default mongoose.model("cflb", cflbschema)