

export const  andreaniLogin = async(req,res) => {
    try {
        const body = {
            "userName": process.env.ANDREANI_USER,
            "password": process.env.ANDREANI_PASS
        }
        const response = await fetch('https://apisqa.andreani.com/login',{
            headers:{
                "Content-Type":"application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            method:"post",
            body:body
        })
        console.log(response);
        
        const info = await response.json();
        res.status(200).json({Payload:info});
    } catch (error) {
        res.status(500).json({message:"Error de conexion"})
    }
}