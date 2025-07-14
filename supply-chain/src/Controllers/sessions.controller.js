
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
        req.session.destroy(e => {
            console.log("Fallo al destruir la session ",e);
        });
        res.status(200).clearCookie('connect.sid').json({Message:"Session destroyed"})
    } catch (error) {
        res.status(500).json({Message:"Session not destroyed"});
    }
}

export const sessionCheck = (req,res) => {
    try {
        console.log(req.session);
        res.status(200).json({Message:"Session check",Payload:req.session})
    } catch (error) {
        res.status(500).json({Message:"Error!"})
    }
}

export const register = async(req,res) => {
    try {
        res.status(201).json({Message:"User created"})
    } catch (error) {
        res.status(500).json({"Message":"Server connection error",Error:error})
    }
}
