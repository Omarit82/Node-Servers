import verbModel from "../Model/verbos.model.js";

export const editorController = async(req,res) => {
    try {
        const check = await verbModel.findOne({verbo_it:req.body.verbo_it});
        if(check){
            res.status(409).json({message:"Verbo già creato"})
        }else{
            const newVerb = await verbModel.create(req.body)
            res.status(201).send(newVerb);
        }
        
    } catch (error) {
        res.status(500).json({message:"Server connection error",error:error})
    }
}

export const getVerbos = async(req,res) => {
    try {
        const verbos = await verbModel.find();
        res.status(200).json({payload:verbos});
    } catch (error) {
        res.status(500).json({message:"Server connection error",error:error})
    }
}

export const getConiugazione = async(req,res) => {
    try {
        const congiugazione = await verbModel.findOne({verbo_it:req.body.verbo});
        if(!congiugazione){
            res.status(400).json({message:"Verbo non trovato"});
        }else{
            res.status(200).json({message:"Trovato!",payload:congiugazione});
        }
    } catch (error) {
        res.status(500).json({message:"Server connection error",error:error})
    }
}
