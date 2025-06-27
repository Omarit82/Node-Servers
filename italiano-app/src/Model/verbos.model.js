import { model,Schema } from "mongoose";

const verbosSchema = new Schema({
    verbo_it:{
        type:String,
        required: true
    },
    verbo_trd:{
        type:String,
        required:true
    }
})

const verbModel = model("verbos",verbosSchema);

export default verbModel;