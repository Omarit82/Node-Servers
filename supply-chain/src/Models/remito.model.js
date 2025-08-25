import { Schema } from "mongoose";

const counterSchema = new Schema({
    _id:Number,
    seq:Number
})
const Counter = new model("Counter", counterSchema);

const remitoSchema = new Schema({
   numero:{type:Number,unique:true},
   clientId: {type:Schema.Types.ObjectId,ref:"Cliente",required:true},
   items: [itemSchema],
   fecha: {type:Date, default:Date.now}
})

export const remitoModel = new model("Remito",remitoSchema)