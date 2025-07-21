import hubspot from "@hubspot/api-client";
import { exchageForTokens, isAuthorized, refreshAccessToken } from "../utils/hubspot.js";


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
            //Con supply dealstage: 67052576
            const deals = await hub.crm.deals.searchApi.doSearch({
                filterGroups: [{
                    filters: [
                            {
                                propertyName: 'dealstage',
                                operator: 'EQ',
                                value:'67052576' // SE PASO A ENVIAR Y SE GENERÓ LA TAREA DE PROD.
                            },
                            {
                                propertyName:'despachado',
                                operator: 'NOT_HAS_PROPERTY'
                            },
                        ]
                    }
                ],
                properties: [
                    'dealname',
                    'pipeline',
                    'observaciones_para_produccion',
                    'numero_de_remito',
                    'datos_para_envio',
                    'cantidad_citymesh__autocalculada_',
                    'cantidad_de_equipos',
                    'description',
                    'despachado',
                    'nro_de_guia_del_envio',
                    'propuesta_comercial',
                    'hs_num_of_associated_line_items'
                ],
                limit: 50,
                after: 0,
                sorts: [
                    {
                        propertyName:'hs_object_id',
                        direction: 'DESCENDING'
                    }
                ]
            })
            const payload = [];
            const filterTask=[]
            for (const deal of deals.results) {
                const tasks = await hub.crm.deals.basicApi.getById(deal.id,undefined,undefined,['tasks'],undefined,undefined,undefined);
                for (const task of tasks.associations.tasks.results){
                    const aux = await hub.crm.objects.tasks.basicApi.getById(task.id,['hubspot_owner_id']);
                    if (aux.properties.hubspot_owner_id === '50141006'){
                        filterTask.push(aux);   
                    }
                }
                const obj ={
                    Deal:deal,
                    Task:filterTask
                }            
                payload.push(obj);
            }
            res.status(200).json({Payload:payload})         
        }
    } catch (error) {
        console.log('ERROR GET TASKS// ',error);
        res.status(500).json({"Message":error.message})
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