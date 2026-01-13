import { isAuthorized } from "../utils/hubspot"

export const ensureHubspotToken = async(req,res,next) => {
    if(!isAuthorized(req.session)){
        return res.status(401).json({ Message: "No autorizado en HubSpot"});
    }
    const {Create, expires_in} = req.session.hubspotToken;
    const bufferTime = 60000;
    if(Date.now()>(Create+(expires_in*1000)-bufferTime)){
        console.log("Refrescando Token");
        try{
            req.session.hubspotToken = { ...token, Create: Date.now()};
        }catch(error){
            return res.status(500).json({ Message: "Error al refrescar token"});
        }
    }
    next();
}