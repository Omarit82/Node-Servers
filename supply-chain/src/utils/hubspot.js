
export const getAccessToken = async (session) => {
  // Check si existe un token en la session del user.
  if (!session.hubspotToken) {
    console.log('No existe token en el User - refresh del Token');
    const refresh = await refreshAccessToken(session);
    console.log("Buscando el refresh // ",refresh);
    
  }
  return session.hubspotToken.access_token;
};

export const exchageForTokens = async (session,code) =>{
    try {
        console.log('Dentro del ExchangeForTokens // SESSION ID: ',session);
        
        const authCodeProof ={
            'grant_type': 'authorization_code',
            'client_id': process.env.HUBSPOT_CLIENT_ID,
            'client_secret': process.env.HUBSPOT_CLIENT_SECRET,
            'redirect_uri': `http://localhost:${process.env.PORT}/hubspot/oauth-callback`,
            'code': code
        }
        const formData = new URLSearchParams();
        for (const key in authCodeProof) {
            formData.append(key, authCodeProof[key])
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
        //session.hubspotToken = tokens;
        console.log(session);
        return tokens.access_token;
    } catch (error) {
        console.log("ERROR // "+error);
        return (error);
    }
}

export const refreshAccessToken = async (session) => {
    try {
       // console.log("Dentro del refreshAccessToken: // ",session);
        
        const refreshTokenProof = {
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            redirect_uri: `http://localhost:${process.env.PORT}/oauth-callback`
        }
        return await exchageForTokens(session, refreshTokenProof);
    } catch (error) {
        console.error(error);
    }
}


export const isAuthorized = (session) => {
    return session.hubspotToken ? true : false;
};