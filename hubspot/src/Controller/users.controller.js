const GRANT_TYPES = {
  AUTHORIZATION_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
};

let tokenStore = [];

const isAuthorized = () => {
    return !_.isEmpty(tokenStore.refreshToken);
}

const isTokenExpired = () => {
    return Date.now() >= tokenStore.updateAt + tokenStore.expiresIn * 1000;
}

const refreshToken = async () =>{
    const result = await hubspotClient.oauth.tokenApi.create(
        GRANT_TYPES,
        undefined,
        undefined,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        tokenStore.refreshToken
    );
    tokenStore = result;
    tokenStore.updateAt = Date.now();
    hubspotClient.setAccessToken(tokenStore.accessToken);
}