import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../models/User';

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

// google strategy
const googleLogin = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('google profile', profile);

    try {
      const oldUser = await User.findOne({ email: profile.email });

      console.log('found old user', oldUser)

      if (oldUser) {
        return done(null, oldUser);
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const newUser = await new User({
        provider: 'google',
        googleId: profile.id,
        username: profile.displayName.replace(/\W/g, ""),
        email: profile.email,
      }).save();

      console.log('created new user', newUser)
      done(null, newUser);
    } catch (err) {
      console.log(err);
    }
  },
);

passport.use(googleLogin);
