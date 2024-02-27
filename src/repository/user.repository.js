import mongoose, { Error } from "mongoose";
import userSchema from "../schema/userSchema.js";



const UserModel = mongoose.model('User', userSchema);

export default class UserRepository{

    async signUp(user, email){
        try{
            // check if user exists
            const ifUser = await UserModel.findOne({email});
            if(!ifUser){
                // if not create and retuen new user
                const newUser = new UserModel(user);
                await newUser.save();
                return newUser;
            }else{
                // if yes throw new err
               throw new Error("User Already Exist Try Signing In");
            }      
        }catch(err){
            // catch the err and throw to controller
            console.log('Error in saving user in database'+' '+err);    
            throw err;       
        }      
    }

    async signIn(email){
        try{
            // check if user exists and return user
            const user = await UserModel.findOne({email});
            return user;
        }catch(err){
            console.log('Error in login'+''+err);
        }
    }
}