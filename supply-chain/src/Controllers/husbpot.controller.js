import hubspot from "@hubspot/api-client";
import { exchageForTokens, isAuthorized, refreshAccessToken } from "../utils/hubspot.js";

export const getCompanies = async (req,res) => {
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
        //Llamado a la API
        const limit = 100;
        const after = undefined;
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
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
            const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});    
            const deal = await hub.crm.deals.basicApi.getById(38468871836,['observaciones_para_produccion','numero_de_remito','numero_de_remito','description','datos_para_envio','cantidad_de_equipos']);
            //console.log(deal);
            //const propiedades = await hub.crm.properties.coreApi.getAll('deal'); //390 observaciones de produccion - 387 Remito - 383 Guia - 18 Descripcion del Deal - 17 deal type - 12 datos envio - 4 cantidad de equipos - cantidad total(autogenerada) - 2 Cantidad de productos Amiar
            //const props =[propiedades.results[390],propiedades.results[387],propiedades.results[383],propiedades.results[18],propiedades.results[17],propiedades.results[12],propiedades.results[4],propiedades.results[2]];
            //const id = associations.results[2].toObjectId;        
            //const task = await hub.crm.objects.tasks.basicApi.getById(id,['hs_task_status', 'hs_task_priority', 'hs_task_subject', 'hs_task_body',"hs_task_is_completed","hs_task_is_overdue",'hs_timestamp','hubspot_owner_id']);
            const asociaciones = await hub.crm.associations.v4.basicApi.getPage('deals',dealId,'tasks',undefined,100);

            const tareas = [];

            for (const association of asociaciones.results) {
            const taskId = association.toObjectId;

            const taskDetails = await hub.crm.tasks.basicApi.getById(taskId, [
                'hs_task_subject',
                'hs_task_body',
                'hs_task_status',
                'hs_task_priority',
                'hs_task_assigned_to',
                'hs_task_due_date',
                'hs_task_create_date',
                'hs_task_last_modified_date'
            ]);

            tareas.push({
                subject: taskDetails.body.properties.hs_task_subject,
                body: taskDetails.body.properties.hs_task_body,
                status: taskDetails.body.properties.hs_task_status,
                priority: taskDetails.body.properties.hs_task_priority,
                assignedTo: taskDetails.body.properties.hs_task_assigned_to,
                dueDate: taskDetails.body.properties.hs_task_due_date,
                createdAt: taskDetails.body.properties.hs_task_create_date,
                lastModifiedAt: taskDetails.body.properties.hs_task_last_modified_date
            });
            }
            res.status(200).json({Payload:deal})         
        }
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
            const contacts = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
            const limit = 100;
            const after = 74273;
            const properties = undefined;
            const propertiesWithHistory = undefined;
            const associations = undefined;
            const archived = false;
            const response = await contacts.crm.contacts.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
            res.status(200).json({Payload:response})    
        }
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

export const getAccessToken = async (req,res,next) => {
  // Check si existe un token en la session del user.
  if (req.session.hubspotToken) {
    console.log('El user tiene Token');
    next()
  }
  hubspotConnection();
};