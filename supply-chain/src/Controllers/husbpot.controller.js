import { exchageForTokens } from "../utils/hubspot.js";


export const getTasks = async(req,res) => {
    /**Tengo que hacer la llamada async a hubspot */
    try {
        
    } catch (error) {
        
    }
}

export const hubspotConnection =(req,res) => {
    try {
        //HUBSPOT APP CONFIG  
        const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
        const REDIRECT_URI = `http://localhost:${process.env.PORT}/hubspot/oauth-callback`;
        //OAuth 2.0 flow
        const authURL = 
            'https://app.hubspot.com/oauth/authorize'+
            `?client_id=${encodeURIComponent(HUBSPOT_CLIENT_ID)}`+
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=oauth`
        res.redirect(authURL);     
    } catch (error) {
        
    }
}


export const handleCallback = async (req,res) => {
    try {
        if(req.query.code){
            console.log('CODE // '+req.query.code)
            const token = await exchageForTokens(req.sessionID,req.query.code);            
            if(token.message){
                return res.redirect(`/error?msg=${token.message}`);
            }
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        
    }
}