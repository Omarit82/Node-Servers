import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    date_gen:{
        type:Date,
        default:Date.now
    },
    date_todo:{
        type:Date,
        required:true
    },
    date_done:{
        type:Date,
        required:false
    },
    description:{
        type:String
    },
    done:{
        type:Boolean,
        default: false
    }
});

const taskModel = model('task',taskSchema);
export default taskModel;