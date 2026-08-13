import mongoose from "mongoose";
import User from "./models/users.model.js";
import Codeforces from "./models/cfstats.model.js";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI!);
  
  const rust7 = await User.findOne({ codeforces_username: "Rust7" });
  if (rust7) {
      const doc = await Codeforces.findOne({ user: rust7._id });
      console.log(doc);
  }

  process.exit(0);
}

test();
