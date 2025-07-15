import session from "express-session";

export const exchageForTokens = async (sessionID,code) =>{
    try {
        console.log('TEST // SESSION ID: ',sessionID);
        
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
        session.hubspotToken = tokens;
        return tokens.access_token;
    } catch (error) {
        console.log("ERROR // "+error);
        return (error);
    }
}

export const refreshAccessToken = async (userId) => {
    try {
        const refreshTokenProof = {
            grant_type: 'refresh_token',
            client_id: process.env.HUBSPOT_CLIENT_ID,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET,
            redirect_uri: `http://localhost:${process.env.PORT}/oauth-callback`,
            refresh_token: refreshTokenStore[userId]
        }
        return await exchageForTokens(userId, refreshTokenProof);
    } catch (error) {
        console.error(error);
    }
}

export const getAccessToken = async (userId) => {
  // If the access token has expired, retrieve a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log('Refreshing expired access token');
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

export const isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};