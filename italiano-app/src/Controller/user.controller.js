

export const login = (req,res) => {
    try {
        const {user,pass} = req.body;    
        res.status(200).json({user:user,pass:pass})
    } catch (error) {
        res.status(400).json({message:"Error server connection"})
    }
   

}

export const register = (req,res) => {

}