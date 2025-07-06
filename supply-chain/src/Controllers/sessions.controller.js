
export const login = async(req,res) => {
    try {
        const { email, password } = req.body
        res.status(200).json({payload:[email,password]})
    } catch (error) {
        res.status(500).json({Message:"Server connection Error",Error:error})
    }
}

export const register = (req,res) => {

}