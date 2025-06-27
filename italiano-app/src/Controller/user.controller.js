import { encriptar } from "../bcrypt.js";
import userModel from "../Model/user.model.js";

export const login = (req,res) => {
    try {
        const {user,pass} = req.body;    
        res.status(200).json({user:user,pass:pass})
    } catch (error) {
        res.status(400).json({message:"Error server connection"})
    }
   

}

export const register = async(req,res) => {
    try {
        console.log(req.body);
        const check = await userModel.findOne({"user_email":req.body.user_email})
        if (check){
            /**El usuario ya existe */
            res.status(409).json({message:"user already exists"});
        }else{
            const data = {
                "user_name": req.body.user_name,
                "user_lastname": req.body.user_lastname,
                "user_email": req.body.user_email,
                "user_pass": encriptar(req.body.user_pass),
                "user_file": req.body.file
            }
            const register = await userModel.create(data);
            const response = await register.json();
            res.status(201).json({payload:response})
        }
         
        
    } catch (error) {
        res.status(500).json({message:"Error server connection"})
    }
}