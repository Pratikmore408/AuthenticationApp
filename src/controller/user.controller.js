import UserModel from "../model/user.model.js";
import UserRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt'

export default  class UserController{
    constructor(){
        this.userRepository = new UserRepository();

    }

    async getHome(req, res){
        res.render('home', {
            userEmail: req.session.userEmail
        })
    }

    async getSignup(req, res){
        res.render('signup', {
            errorMessage: null
        })
    }

    async postSignup(req, res){
        const { name, email, password, confirmPassword} = req.body;

        try{
            if(password !== confirmPassword){
                res.render('signup', {
                    errorMessage: "Password and Confirm-Password Should Match"
                });
            }else{
                const hashedPassword = await bcrypt.hash(password, 12);
    
                const newUser =  new UserModel(name, email, hashedPassword);
                await this.userRepository.signUp(newUser, email);
                
                res.redirect('/signin');
                            
            }
        }catch(err){
            console.log(err);
            res.render('signup', {
                errorMessage: err.message
            });
        }
        
    }

    async getSignin(req, res){
        res.render('signin', {
            errorMessage:null,
        })
    }

    async postSignin(req, res){
        const { email, password} = req.body;
        const user = await this.userRepository.signIn(email);
        if(!user){
            res.render('signin', {
                errorMessage:"Invalid Credentials"
            });
        }else{
            
            const result = await bcrypt.compare(password, user.password);

            if(result){  
                req.session.userEmail = email;
                res.render('home',{
                    userEmail: req.session.userEmail,
                });

            }else{
                res.render('signin', {
                    errorMessage:"Invalid Credentials"
                });
            }
        }
    }

    async signOut(req, res){
        try{
            req.session.destroy((err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/signin');
                }
            })
        }catch(err){
            console.log(err);
        }
    }
}
