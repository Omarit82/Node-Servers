import hubspot from '@hubspot/api-client';


export const getTasks = async(req, res) => {
    try {
        const hubspotClient = new hubspot.Client();
        const properties = ['company']
        const tasks = await hubspotClient.crm.tickets.basicApi.getPage(10,undefined,properties);

        res.status(200).json({payload:tasks}); 
    } catch (error) {
        res.status(500).json({message:"Connection error",error:error})
    }
}