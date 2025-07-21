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
            const deals = await hub.crm.deals.searchApi.doSearch({
                properties: [
                    'dealname',
                    'pipeline',
                    'observaciones_para_produccion',
                    'numero_de_remito',
                    'description',
                    'datos_para_envio',
                    'cantidad_de_equipos'
                ],
                limit: 100,
                after: 6320
            })
            const dealsId = []
            deals.results.forEach(element => {
                dealsId.push(element.id);
            });
            const valorAsociado = await hub.crm.deals.basicApi.getById(dealsId[86],['dealname'],undefined,['tasks'],undefined,undefined,undefined);
            const taskAsociada = await hub.crm.objects.tasks.basicApi.getById(valorAsociado.associations.tasks.results[0].id);
            const tasks = await hub.crm.objects.tasks.searchApi.doSearch({
                filterGroups: [{
                    filters: [
                            {
                                propertyName:'id',
                                operator:'EQ',
                                value: taskAsociada.id
                            },
                            {
                                propertyName: 'hs_task_status',
                                operator: 'NEQ',
                                value: 'COMPLETED'
                            },
                            {
                                propertyName: 'hubspot_owner_id',
                                operator: 'EQ',
                                value: '50141006'
                            },
                            {
                                propertyName: 'hs_body_preview',
                                operator: 'HAS_PROPERTY'
                            }
                        ]
                    }
                ],
                properties: [
                    'hs_all_accessible_team_ids',
                    'hs_task_completion_count',
                    'hs_task_is_completed',
                    'hs_task_is_past_due_date',
                    'hs_task_priority',
                    'hs_timestamp',
                    'hubspot_owner_id',
                    'hs_engagement_source_id',
                    'hs_task_status',
                    'hs_task_subject',
                    'hs_body_preview',
                    'hs_deal_id'
                ],
                limit: 50,
                after: 0 ,
                sorts:[
                    {
                        propertyName:'hs_timestamp',
                        direction: 'ASCENDING'
                    }
                ]
            })
            res.status(200).json({Deals:dealsId, Associations:valorAsociado,AssociatedTask:tasks})         
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