import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.DB_PASSWORD;

// encode the password
const encodedPassword = encodeURIComponent(dbPassword);


const url =`mongodb+srv://pratikmore408:${encodedPassword}@cluster0.bibaswd.mongodb.net/AuthenticationApp?retryWrites=true&w=majority`;

export const connectToDb = ()=>{
    try{
        mongoose.connect(url);
        console.log("connected to mongodb database");
    }catch(err){
        console.log("Error in connecting to Database"+ err);
    }
}