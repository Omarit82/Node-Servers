import verbModel from "../Model/verbos.model.js";

export const editorController = async(req,res) => {
    try {
        const check = await verbModel.findOne({verbo_it:req.body.verbo_it});
        console.log(check);
        if(check){
            res.status(409).json({message:"Verbo già creato"})
        }else{
            const newVerb = await verbModel.create(req.body)
            res.status(201).send(newVerb);
        }
        
    } catch (error) {
        res.status(500).json({message:"Server connection error"})
    }
}

