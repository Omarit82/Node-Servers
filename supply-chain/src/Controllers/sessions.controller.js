
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

export const logout = async(req,res,next) => {
    try {
        req.logout((err)=>{
            if(err){
                return next (err)
            }
            if (!req.session) {
                return res.status(400).json({ Message: "No existe una session activa." });
            }
            req.session.destroy(err => { 
                if (err) {
                        console.error("Error al destruir la sesión en MongoDB:", err);
                        return res.status(500).json({ Message: "Error al cerrar sesión" });
                }
                res.clearCookie('connect.sid');
                res.status(200).json({ Message: "Sesión cerrada exitosamente" });
            })
        })         
    } catch (error) {
        res.status(500).json({Message:"Session no eliminada"});
    }
}

export const register = async(req,res) => {
    try {
        res.status(201).json({Message:"User created"})
    } catch (error) {
        res.status(500).json({"Message":"Server connection error",Error:error})
    }
}
