import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/users.model"


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {

      const email = profile.emails?.[0].value;

     if (!email) {
  return done(null, false, {
    message: "No email found",
  });
}

     if (!email.endsWith("@bitmesra.ac.in")) {
          return done(null, false, {
            message: "Only BIT Mesra email accounts are allowed",
        });
      }

      let user = await User.findOne({
        email
      });

      if( !user) {
        user = await User.create({
          googleID: profile.id,
          name: profile.displayName,
          email,
          avatar: profile.photos?.[0].value
        })
      }

      return done(null, user)
    }
  )
);