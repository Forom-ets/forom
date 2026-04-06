import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';
import User from './../database/models/User'; // mock user class
import { type UserRecord } from './../database/models/User';
import { v4 as uuidv4 } from 'uuid';

const options = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${process.env.BE_BASE_URL}/api/auth/google/callback`,
};

async function verify(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
  try {
    // we check for if the user is present in our system/database.
    // which states that; is that a sign-up or sign-in?
    let user: UserRecord | null = await User.findOne({
      where: {
        googleId: profile.id,
      },
    });

    // if not
    if (!user) {
      // create new user if doesn't exist
      user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        fullName: profile.displayName,
        jwtSecureCode: uuidv4(),
      });
    }

    // auth the User
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}

export default new GoogleStrategy(options, verify);