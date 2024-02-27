
import express from 'express'
import UserController from '../controller/user.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import passport from 'passport';


const userRouter = express.Router();

const userController = new UserController();

userRouter.get('/', auth, (req, res)=>{
    userController.getHome(req, res)
});

userRouter.get('/signup', (req, res)=>{
    userController.getSignup(req, res)
});

userRouter.post('/signup', (req, res)=>{
    userController.postSignup(req, res)
});

userRouter.get('/signin', (req, res)=>{
    userController.getSignin(req, res)
});

userRouter.post('/signin', (req, res)=>{
    userController.postSignin(req, res)
});

userRouter.get('/signout', auth, (req, res)=>{
    userController.signOut(req, res)
});

userRouter.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

userRouter.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/signin'}), (req, res)=>{
    userController.getHome(req, res)});

export default userRouter