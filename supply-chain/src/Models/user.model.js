import { model, Schema } from "mongoose";


const userSchema = new Schema({
    nombre:{
        type:String,
        required:true
    },
    apellido:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    user:{
        type: String,
        default:"user"
    }
});

export const userModel = new model("Users",userSchema);