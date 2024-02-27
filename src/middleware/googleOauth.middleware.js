import passport from 'passport';
import dotenv from 'dotenv'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import crypto from 'crypto';
import userSchema from '../schema/userSchema.js';
import mongoose from 'mongoose';

dotenv.config();

const UserModel = mongoose.model('User', userSchema);

// tell passport to create a new strategy for google login
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: process.env.CB_URL
},
async (accessToken, refreshToken, profile, done) => {
    // find user
    try {
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user);
        } else {
            user = await UserModel.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            
            return done(null, user);
        }
    } catch (error) {
        console.log("Error in passport google strategy file", error);
    }
}));

export default passport;
