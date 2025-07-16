import { hubspotConnection } from "../Controllers/husbpot.controller.js";

export const getAccessToken = async (session) => {
  // Check si existe un token en la session del user.
  if (!session.hubspotToken) {
    console.log('No existe token en el User - refresh del Token');
  }
  hubspotConnection();
};

export const refreshAccessToken = async (session) => {
    try {
        const refreshTokenProof = {
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            redirect_uri: `http://localhost:${process.env.PORT}/oauth-callback`,
            refresh_token: session.hubspotToken.refresh_token
        }
        console.log("Dentro del refreshAccessToken: // ");
        const response = await exchageForTokens(refreshTokenProof);
        console.log("Respuesta del refresh: ",response);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const exchageForTokens = async (code) =>{
    try {
        const formData = new URLSearchParams();
        for (const key in code) {
            formData.append(key, code[key])
        }
        const responseBody = await fetch('https://api.hubapi.com/oauth/v1/token',{
            method:"POST",
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body:formData
        })
        const response = await responseBody.text();
        let parsedBody;
        try {
            parsedBody = JSON.parse(response);
        } catch (error) {
            parsedBody = response;
        }
        if(!responseBody.ok){
            throw new Error(`HTTP Error! status:${response.status} // ${response.statusText}`);
        }
        const tokens = await parsedBody;
        return tokens;
    } catch (error) {
        return (error);
    }
}


export const isAuthorized = (session) => {
    return session.hubspotToken ? true : false;
};