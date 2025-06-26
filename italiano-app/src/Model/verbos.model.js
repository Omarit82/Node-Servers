import { model,Schema } from "mongoose";

const verbos = new Schema(
    Verbo_it = {
        type:String,
        required: true
    },
    Verbo_trd = {
        type:String,
        required:true
    }
)

const verbModel = model("Verbi",verbos);

export default verbModel;