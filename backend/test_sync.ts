import mongoose from "mongoose";
import User from "./models/users.model.js";
import Codeforces from "./models/cfstats.model.js";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI!);
  
  const user = await User.findOne({ codeforces_username: "Rust7" });
  if (user) {
      const cfDoc = await Codeforces.findOne({ user: user._id });
      if (cfDoc) {
          cfDoc.streak = 2; // Fixed from 1
          await cfDoc.save();
          console.log("Updated Rust7 streak to 2.");
      }
  }

  process.exit(0);
}

test();
