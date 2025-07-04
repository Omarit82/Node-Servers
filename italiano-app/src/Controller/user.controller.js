import { encriptar, paswordCheck } from "../bcrypt.js";
import userModel from "../Model/user.model.js";
import session from "express-session";

export const login = async(req,res) => {
    try {
        const {email,pass} = req.body;
        //GESTION DE LOGIN - CHECKEO SI EL USUARIO EXISTE - COMPARO LOS PASSWORDS
        const consulta = await userModel.findOne({user_email:email});
        if(consulta){
            const resultado = paswordCheck(pass,consulta.user_password);
            if(resultado){
                // AGREGO INFO A LA SESSION -> CHEQUEO COOKIE POR THEME*
                session.Session.user = {
                    "user_name": consulta.user_name,
                    "user_avatar": consulta.user_avatar 
                }
                console.log(session);
                
                res.status(200).json({"Login":resultado,"Message":"Login!"})
            }else{
                res.status(400).json({"Message":"Login failed!"})
            }
        }else{
            res.status(404).json({message:"User not found"})  
        }
    } catch (error) {
        res.status(500).json({message:"Error server connection"})
    }
   

}

export const register = async(req,res) => {
    try {
        const check = await userModel.findOne({user_email:req.body.user_email})
        if (check){
            /**El usuario ya existe */
            res.status(409).json({message:"user already exists"});
        }else{
            const data = {
                "user_name": req.body.user_name,
                "user_lastname": req.body.user_lastname,
                "user_email": req.body.user_email,
                "user_password": encriptar(req.body.user_pass),
                "user_avatar": req.body.file
            }
            const register = await userModel.create(data);
            res.status(201).json({payload:register})
        }
    } catch (error) {
        res.status(500).json({message:"Error server connection"})
    }
}