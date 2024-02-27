import {sendMail} from "../config/nodemailer.js";
import UserModel from "../model/user.model.js";
import UserRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt'

export default  class UserController{
    constructor(){
        // import repository
        this.userRepository = new UserRepository();

    }

    // render home page
    async getHome(req, res){
        res.render('home', {
            userEmail: req.session.userEmail
        })
    }

    // render signup form
    async getSignup(req, res){
        res.render('signup', {
            errorMessage: null
        })
    }


    async postSignup(req, res){
        // get elements from body
        const { name, email, password, confirmPassword} = req.body;

        try{
            // check if both passwords are same or not
            if(password !== confirmPassword){
                // if not return error
                res.render('signup', {
                    errorMessage: "Password and Confirm-Password Should Match"
                });
            }else{
                // hash the password
                const hashedPassword = await bcrypt.hash(password, 12);
                // create new user model
                const newUser =  new UserModel(name, email, hashedPassword);
                // save the user in db
                await this.userRepository.signUp(newUser, email);
                // load the signin form
                res.redirect('/signin');
                            
            }
        }catch(err){
            // return err with err msg
            console.log(err);
            res.render('signup', {
                errorMessage: err.message
            });
        }
        
    }

    // render the signin form
    async getSignin(req, res){
        res.render('signin', {
            errorMessage:null,
        })
    }

    async postSignin(req, res){
        // get elements from body
        const { email, password} = req.body;
        // check if user exists
        const user = await this.userRepository.signIn(email);
        if(!user){
            // if not return err
            res.render('signin', {
                errorMessage:"Invalid Credentials"
            });
        }else{
            // if exists then compare the password
            const result = await bcrypt.compare(password, user.password);

            if(result){  
                // if password is correct set the session email with current user email
                req.session.userEmail = email;
                await sendMail(email);
                // render the home page
                res.render('home',{
                    userEmail: req.session.userEmail,
                });

            }else{
                 // if not return err
                res.render('signin', {
                    errorMessage:"Invalid Credentials"
                });
            }
        }
    }

    async signOut(req, res){
        try{
            // destroy the session
            req.session.destroy((err)=>{
                if(err){
                    // if err print the err
                    console.log(err);
                }else{
                    // load the sign in form
                    res.redirect('/signin');
                }
            })
        }catch(err){
            console.log(err);
        }
    }
}
