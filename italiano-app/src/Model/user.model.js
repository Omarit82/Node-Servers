import { model,Schema } from 'mongoose';

const userSchema = new Schema (
    user_name = {
        type: String,
        required: true
    },
    user_email = {
        type: String,
        required: true
    },
    user_password = {
        type: String,
        required: true
    }
);

const userModel = model('Users',userSchema);

export default userModel;

