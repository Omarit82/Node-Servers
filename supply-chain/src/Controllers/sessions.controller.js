import { ensureAuthenticate } from "../Config/passport.config.js";

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
        res.status(200).json({Message:"User logued",Session:req.session.user});
    } catch (error) {
        res.status(500).json({Message:"Server connection error"});
    }
}
export const getUser = (req,res) => {
    if(req.isAuthenticated()){
        console.log("Autenticado!");
        return res.status(200).json({user: req.user});
    }else{
        console.log("No Autenticado!");
        return res.status(401).json({message:"No autenticado"});
    }
}

export const loginGoogle = async(req,res) => {
    try {
        req.session.user={
            email:req.user.email,
            nombre: req.user.nombre,
            apellido:req.user.apellido
        }
        console.log("SESSION ANTES DEL REDIRECT: ",req.session);
        res.redirect('http://localhost:5173/home');
    } catch (error) {
        res.status(500).json({Message:"Server connection error"});
    }
}

export const logout = async(req,res,next) => {
    try {
        if (!req.session) {
            return res.status(400).json({ Message: "No existe una session activa." });
        }
    
        req.logout((err)=>{
            if(err){
                return next (err)
            }
            const sessionId = req.sessionID;
            req.session.destroy(err => { 
                if (err) {
                    return res.status(500).json({ Message: "Error al cerrar sesión" });
                }
                req.sessionStore.destroy(sessionId,(storeErr) => {
                    if (storeErr) {
                        return res.status(500).json({Message:"No se pudo eliminar la sesion del storage"})
                    }
                    res.clearCookie('connect.sid',{ path: '/',httpOnly:true,secure:false,sameSite:'none'});
                    return res.status(200).json({ Message: "Sesión cerrada exitosamente" });
                })                
            })
        })         
    } catch (error) {
        res.status(500).json({Message:"Session no eliminada"});
    }
}

export const register = async(req,res) => {
    try {
        res.status(201).json({Message:"User created",Payload: req.body})
    } catch (error) {
        res.status(500).json({"Message":"Server connection error",Error:error})
    }
}
