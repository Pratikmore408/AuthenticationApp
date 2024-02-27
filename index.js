import express from 'express'
import dotenv from 'dotenv'
import path from 'path';
import ejsLayouts from "express-ejs-layouts";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { connectToDb } from './src/config/mongoose.js';
import userRouter from './src/routes/user.routes.js';
import passport from 'passport';
import userSchema from './src/schema/userSchema.js';
import passportGoogle from './src/middleware/googleOauth.middleware.js'; 
import mongoose from 'mongoose';


const UserModel = mongoose.model('User', userSchema);

dotenv.config();
// create the server
const app = express();

// configure session
app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {secure: false},
}));

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
// set the view engine
app.set('view engine', 'ejs');
app.set("views", path.join(path.resolve(), 'src', 'view'))
app.use(ejsLayouts);

app.use(passport.initialize());
app.use(passport.session());

// serialize and deserialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (req, id, done) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return done(new Error('User not found'));
        }
        // set the session with use email
        req.session.userEmail = user.email;
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// call the user router
app.use('/', userRouter);

app.use(express.static('src/view'))

// listen the server
app.listen(4000, (req, res)=>{
    console.log(`app is running on port 4000`);
    connectToDb();
})
