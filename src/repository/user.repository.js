import mongoose, { Error } from "mongoose";
import userSchema from "../schema/userSchema.js";



const UserModel = mongoose.model('User', userSchema);

export default class UserRepository{

    async signUp(user, email){
        try{
            const ifUser = await UserModel.findOne({email});
            if(!ifUser){
                const newUser = new UserModel(user);
                await newUser.save();
                return newUser;
            }else{
               throw new Error("User Already Exist Try Signing In");
            }      
        }catch(err){
            console.log('Error in saving user in database'+' '+err);    
            throw err;       
        }      
    }

    async signIn(email){
        try{
            const user = await UserModel.findOne({email});
            console.log(user);
            return user;
        }catch(err){
            console.log('Error in login'+''+err);
        }
    }
}