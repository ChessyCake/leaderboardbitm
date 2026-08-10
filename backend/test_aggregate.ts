import mongoose from "mongoose";
import User from "./models/users.model.js";
import Codeforces from "./models/cfstats.model.js";
import LeetCode from "./models/lcstats.model.js";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI!);
  
  const rust7 = await User.findOne({ codeforces_username: "Rust7" });
  if (rust7) {
      const rust7CFs = await Codeforces.find({ user: rust7._id });
      console.log(`Found ${rust7CFs.length} CF documents for Rust7`);
      for (const doc of rust7CFs) {
          console.log(`  - _id: ${doc._id}, todaySolved: ${doc.todaySolved}, streak: ${doc.streak}`);
      }
  }

  process.exit(0);
}

test();
