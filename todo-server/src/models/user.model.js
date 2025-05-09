import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    userName = {
        type:String,
        required: true
    },
    email = {
        type:String,
        required:true,
        unique:true
    }

)