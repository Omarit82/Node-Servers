import verbModel from "../Model/verbos.model.js";
import Reverso from 'reverso-api';

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

export const getConiugazione = async (req,res) => {
    try {
        const verbo = req.body;
        const rev = new Reverso();
        rev.getConjugation(verbo.verbo,'italian',(err,response)=>{
            if(err)throw new Error(err.message)
            res.status(200).json({payload:response})
        })

    } catch (error) {
        res.status(500).json({message:"Server connection error",error:error})
    }
}
