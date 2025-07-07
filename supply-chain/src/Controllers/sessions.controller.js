import { userModel } from "../Models/user.model.js";
import { checkPassword, encriptar } from "../utils/bcrypt.js";

export const login = async(req,res) => {
    try {
        if(!req.user){
            return res.status(401).json({Message:"User or password invalid"});
        }
        req.session.user={
            email:req.user.email,
            nombre: req.user.nombre,
            apellido:req.user.apellido
        }
        res.status(200).json({Message:"User logued"});
    } catch (error) {
        res.status(500).json({Message:"Server connection error"});
    }
}

export const logout = async(req,res) => {
    try {
        req.session.destroy
    } catch (error) {
        
    }
}

export const register = async(req,res) => {
    try {
        if(!req.user){
            return res.status(400).json({Message:"Error creating user"});
        }
        res.status(201).json({Message:"User created"})
    } catch (error) {
        res.status(500).json({"Message":"Server connection error",Error:error})
    }
}