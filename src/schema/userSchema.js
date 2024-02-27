import mongoose from "mongoose";

// user schema
const userSchema = mongoose.Schema({
    name: String,
    email:{type: String, unique: true, required: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password: String
});

export default userSchema;