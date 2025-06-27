import verbModel from "../Model/verbos.model.js";

export const editorController = async(req,res) => {
    try {
        const {verbo_it,verbo_trd} = req.body;
        const newVerb = await verbModel.create({verbo_it,verbo_trd})
        res.status(201).json({message:"added",payload:req.body});
    } catch (error) {
        res.status(500).json({message:"Server connection error"})
    }
}

