import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../app/modules/user/user.model";
import { Role } from "../app/modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        // console.log("Checking user with email:", email);

        const user = await User.findOne({ email }).select("+password"); // ✅ Fix: findOne and include password


        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // Check if user authenticated via Google
        const isGoogleAuthenticated = user?.auths?.some((obj) => obj.provider === "google");

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message: "You signed up with Google. Please login via Google or set a password.",
          });
        }

        // Compare password
        const isPasswordMatched = await bcryptjs.compare(password, user.password as string);
        console.log("found user password matched", isPasswordMatched)
        if (!isPasswordMatched) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        console.error("LocalStrategy Error:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialize Error:", error);
    done(error);
  }
});
