import session from "express-session";
import hubspot from "@hubspot/api-client";
import { exchageForTokens, isAuthorized } from "../utils/hubspot.js";

export const getTasks = async (req,res) => {
    try {
        console.log(req.session);
        //isAuthorized()
        const hub = new hubspot.Client({"accessToken":session.hubspotToken.access_token});
        const limit = 100;
        const after = 39613969944;
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        const response = await hub.crm.deals.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
        res.status(200).json({Payload:response})
    } catch (error) {
        console.log('ERROR // ',error);
        res.status(500).json({"Message":error.message})
    }
}

export const getContacts = async(req,res) => {
    /**Tengo que hacer la llamada async a hubspot */
    try {
        const contacts = new hubspot.Client({"accessToken":session.hubspotToken.access_token});
        const limit = 100;
        const after = undefined;
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

export const hubspotConnection =(req,res) => {
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
        if(req.query.code){
            const token = await exchageForTokens(req.sessionID,req.query.code);            
            if(token.message){
                return res.redirect(`/error?msg=${token.message}`);
            }
            res.redirect('/hubspot/tasks');
        }
    } catch (error) {
        console.error(error);
        
    }
}