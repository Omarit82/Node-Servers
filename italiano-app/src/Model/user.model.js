import { model,Schema } from 'mongoose';

const userSchema = new Schema({
    user_name: {
        type: String,
        required: true
    },
    user_lastname: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    user_password : {
        type: String,
        required: true
    },
    user_avatar:{
        type:String,
    },
    user_type:{
        type:String,
        default:"user"
    }
});

const userModel = model('users',userSchema);

export default userModel;

