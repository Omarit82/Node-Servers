import hubspot from "@hubspot/api-client";
import { exchageForTokens, isAuthorized, refreshAccessToken } from "../utils/hubspot.js";

export const taskProperties = async(req,res) => {
    try {
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const resultado = await hub.crm.properties.coreApi.getAll('task');
        res.status(200).json({Payload:resultado})
    } catch (error) {
        res.status(500).json({Message: error.message});
    }
}
export const dealProperties = async(req,res) => {
    try {
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const resultado = await hub.crm.properties.coreApi.getAll('deal');
        res.status(200).json({Payload:resultado})
    } catch (error) {
        res.status(500).json({Message: error.message});
    }
}
export const getLineItemFromDeal = async(req,res) => {
    try {
        const dealId = req.params.id;
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const associations = await hub.crm.associations.v4.basicApi.getPage('deal',dealId,'line_item',100,undefined);
        const lineItemsId = associations.results.map(a => a.toObjectId);
        if(lineItemsId.length === 0){
            res.status(200).json({Message:"No se encontraron line items.",Payload:[]});
        }else{
            const batch = await hub.crm.lineItems.batchApi.read({
                inputs:lineItemsId.map(id=>({id})),
                properties: ['name','quantity','hs_product_id']
            })
            res.status(200).json({Payload:batch});
        }
        
    } catch (error) {
        res.status(500).json({Message: error.message})
    }
}

export const updateDeal = async (req,res) => {
    console.log('BODY// ',req.body);
    console.log(req.body.dealId);
    
    try {
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const envioInfo = await hub.crm.deals.basicApi.update(req.body.dealId,{
            properties:{
                observaciones_para_produccion: req.body.observaciones,
                numero_de_remito: req.body.remito,
                nro_de_guia_del_envio: req.body.guia
            }
        });
        res.status(200).json({Message:"Deal updated"})
    } catch (error) {
        console.log("Hubspot Error: ",JSON.stringify(error.response?.body || error, null,2));
        
        res.status(error.statusCode || 500).json({Message:error.message,Details: error.response?.body})
    }
}
export const getTask = async(req,res) => {
    try {
        const id = req.params.id;
        const tarea=[];
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const tasks = await hub.crm.deals.basicApi.getById(id,undefined,undefined,['tasks'],undefined,undefined,undefined);
        for (const task of tasks.associations.tasks.results){
            const aux = await hub.crm.objects.tasks.basicApi.getById(task.id,[
            'hubspot_owner_id',
            'hs_task_is_completed',
            'hs_task_is_past_due_date',
            'hs_task_priority',
            'hs_timestamp',
            'hs_task_status',
            'hs_task_subject',
            'hs_body_preview',
            'hs_task_type',
            'hs_task_is_overdue'
            ]);
            if (aux.properties.hubspot_owner_id === '50141006'){
                 tarea.push(aux);
            }
        }
        res.status(200).json({Task:tarea})
    } catch (error) {
        res.status(500).json({Message:"Error de conexion al realizar getTask"})
    }
}
export const getAllDeals = async(req,res) => {
    try {
        if(!isAuthorized(req.session)){
            res.redirect('/hubspot/install')
        } else {
            if(parseInt(Date.now()/1000)>(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in)){               
                const token = await refreshAccessToken(req.session);
                req.session.hubspotToken = token;
                req.session.hubspotToken.Create = Date.now();
            }  
            const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token}); 
            const deals = await hub.crm.deals.basicApi.getById(41514195259,[
                    'dealstage',
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
                    'hs_num_of_associated_line_items',
                    'hs_deal_amount_calculation_preference']
            );
            res.status(200).json({payload:deals})
        }  
    } catch (error) {
        res.status(500).json({"Message":error.message})
    }
}
export const getDeals = async(req,res) => {
    try {
        if(!isAuthorized(req.session)){
            res.redirect('/hubspot/install')
        } else {
            if(parseInt(Date.now()/1000)>(parseInt(req.session.hubspotToken.Create/1000)+req.session.hubspotToken.expires_in)){               
                const token = await refreshAccessToken(req.session);
                req.session.hubspotToken = token;
                req.session.hubspotToken.Create = Date.now();
            }  
            const dealstage = req.params.stage;
            let despachado = req.params.completed;
            despachado = JSON.parse(despachado);           
            let prop;
            if(despachado){
                prop = "HAS_PROPERTY" 
            }else{
                prop ="NOT_HAS_PROPERTY"
            }
            const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token}); 
            const deals = await hub.crm.deals.searchApi.doSearch({
                filterGroups: [{
                    filters: [
                            {
                                propertyName: 'dealstage',
                                operator: 'EQ',
                                value: dealstage // SE PASO A ENVIAR Y SE GENERÓ LA TAREA DE PROD.
                            },
                            {
                                propertyName:'despachado',
                                operator: prop 
                            },
                        ]
                    }
                ],
                sorts: ['createdAt'],
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
                    'hs_num_of_associated_line_items',
                    'hs_deal_amount_calculation_preference'
                ],
                limit: 20,
                after: 0,
                
            });
            res.status(200).json({Deals:deals});
        }  
    } catch (error) {
        res.status(500).json({"Message":error.message})
    }
}
export const endTask = async(req,res) => {
    try {
        const id = req.params.id;
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token});
        const tarea = await hub.apiRequest({
            method:"PATCH",
            path:`/engagements/v1/engagements/${id}`,
            body: {
                engagement: {id:id},
                metadata:{
                    status: "COMPLETED"
                }
            }
        });
        res.status(200).json({Message:"Tarea completa", CODE:tarea.status});
    }catch(error){
        console.log("Hubspot Error: ",JSON.stringify(error.response?.body || error, null,2));
        res.status(error.statusCode || 500).json({Message:error.message,Details: error.response?.body})
    }
}

export const analytics = async(req,res) => {
    try {
        const hub = new hubspot.Client({"accessToken":req.session.hubspotToken.access_token}); 
       
        res.status(200).json({Message:"analytics obteined"})

    } catch (error) {
        res.status(500).json({Message:error.message})
    }
}

export const hubspotConnection = (req,res) => {
    try {
        //HUBSPOT APP CONFIG  RECORDAR ACTUALIZAR LOS SCOPES!!
        const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
        const REDIRECT_URI = `http://localhost:${process.env.PORT}/hubspot/oauth-callback`;
        const authURL = 
            'https://app.hubspot.com/oauth/authorize'+
            `?client_id=${encodeURIComponent(HUBSPOT_CLIENT_ID)}`+
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=oauth%20crm.objects.contacts.read%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.orders.read%20crm.objects.products.read%20tickets%20e-commerce%20crm.schemas.line_items.read%20crm.objects.line_items.read%20business-intelligence%20crm.objects.deals.write%20crm.schemas.deals.write%20crm.schemas.deals.read`
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
        res.redirect('http://localhost:5173/');
    }
     catch (error) {
        console.error(error);
    }
}

export const getAccessToken = async (req,res,next) => {
  // Check si existe un token en la session del user.
  if (req.session.hubspotToken) {
    next()
  }
  hubspotConnection();
};