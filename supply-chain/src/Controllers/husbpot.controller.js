import hubspot from "@hubspot/api-client";
import { exchageForTokens, isAuthorized, refreshAccessToken } from "../utils/hubspot.js";

export const getCompanies = async (req,res) => {
    try {
        if(!isAuthorized(req.session)){
            res.redirect('/hubspot/install')
        }else{
            if(parseInt(Date.now()/1000)>(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in)){
                console.log("TOKEN VENCIDO");
                const token = await refreshAccessToken(req.session);
                req.session.hubspotToken = token;
                req.session.hubspotToken.Create = Date.now();
            }           
        }
        console.log(parseInt(Date.now()/1000)-(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in));
        console.log("TOKEN VIGENTE");
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token}); 
        //Llamado a la API
        const response = await hub.crm.companies.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
        res.status(200).json({Payload:response})
    } catch (error) {
        res.status(500).json({"Message":error.message})
    }
}

export const getTickets = async(req,res) => {
    try {
        if(!isAuthorized(req.session)){
            res.redirect('/hubspot/install')
        }else{
            if(parseInt(Date.now()/1000)>(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in)){
                const token = await refreshAccessToken(req.session);
                req.session.hubspotToken = token;
                req.session.hubspotToken.Create = Date.now();
            }           
        }
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token}); 
        const limit = 100;
        const after = undefined;
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        //Llamado a la API
        const response = await hub.crm.tickets.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
        res.status(200).json({Payload:response})
    } catch (error) {
        res.status(500).json({"Message":error.message})
    }
}

export const getTasks = async (req,res) => {
    try {
        if(!isAuthorized(req.session)){
            res.redirect('/hubspot/install')
        }else{
            if(parseInt(Date.now()/1000)>(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in)){
                const token = await refreshAccessToken(req.session);
                req.session.hubspotToken = token;
                req.session.hubspotToken.Create = Date.now();
            }           
        }
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});        
        const limit = 100;
        const after = 39613969944;
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        //Llamado a la API DEALS
        const response = await hub.crm.deals.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived);
        //consulto engagements:
        console.log(response.results[0].id);
        const resultado = [];
        response.results.forEach(deal => {
            console.log(deal.id);
        });
        res.status(200).json({Payload:response})
    } catch (error) {
        console.log('ERROR GET TASKS// ',error);
        res.status(500).json({"Message":error.message})
    }
}

export const getContacts = async(req,res) => {
    /**Tengo que hacer la llamada async a hubspot */
    try {
       if(!isAuthorized(req.session)){
            res.redirect('/hubspot/install')
        }else{
            if(parseInt(Date.now()/1000)>(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in)){
                const token = await refreshAccessToken(req.session);
                req.session.hubspotToken = token;
                req.session.hubspotToken.Create = Date.now();
            }           
        }
        const contacts = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const limit = 100;
        const after = 74273;
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        const response = await contacts.crm.contacts.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
        res.status(200).json({Payload:response})
    } catch (error) {
        console.log('ERROR // ',error);
        res.status(500).json({"Message":"Server connection error"})
    }
}

export const hubspotConnection = (req,res) => {
    try {
        //HUBSPOT APP CONFIG  
        const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
        const REDIRECT_URI = `http://localhost:${process.env.PORT}/hubspot/oauth-callback`;
        const authURL = 
            'https://app.hubspot.com/oauth/authorize'+
            `?client_id=${encodeURIComponent(HUBSPOT_CLIENT_ID)}`+
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=oauth%20crm.objects.contacts.read%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.orders.read%20crm.objects.products.read%20tickets`
        res.redirect(authURL);     
    } catch (error) {
        res.status(500).json({"Message:":"Server connection error"})
    }
}


export const handleCallback = async (req,res) => {
    try {
        const authCodeProof ={
            'grant_type': 'authorization_code',
            'client_id': process.env.HUBSPOT_CLIENT_ID,
            'client_secret': process.env.HUBSPOT_CLIENT_SECRET,
            'redirect_uri': `http://localhost:${process.env.PORT}/hubspot/oauth-callback`,
            'code': req.query.code
        }
        const token = await exchageForTokens(authCodeProof);            
        if(token.message){
            return res.redirect(`/error?msg=${token.message}`);
        }
        req.session.hubspotToken = token;    
        req.session.hubspotToken.Create = Date.now();        
        res.redirect('/hubspot/tasks'); /**DEBIERA IR A HOME?**/
    }
     catch (error) {
        console.error(error);
    }
}