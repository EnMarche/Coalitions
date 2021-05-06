import { store } from 'redux/store';
import { userLoggedIn, userLoggedOut } from 'redux/Login';
import { getRefreshToken } from 'redux/Login/selectors';
import request from 'superagent';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const oauthBaseUrl = `${process.env.REACT_APP_OAUTH_URL}/oauth/v2/auth`;
export const oauthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
export const oauthUrl = `${oauthBaseUrl}?response_type=code&client_id=${oauthClientId}&scope=read:profile+write:profile`;
export const OAUTH_SOURCE = 'coalitions';

export const logoutUrl = `${process.env.REACT_APP_OAUTH_URL}/deconnexion`;
export const forgottenPasswordUrl = `${process.env.REACT_APP_OAUTH_URL}/mot-de-passe-oublie`;

type oauthPayload = {
  client_id?: string;
  code?: string;
  refresh_token?: string;
  grant_type: string;
};

const authCall = async (payload: oauthPayload) => {
  const result = await request
    .agent()
    .post(`${process.env.REACT_APP_API_BASE_URL}oauth/v2/token`)
    .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
    .send(payload);
  const access_token: string | undefined = result.body.access_token;
  const refresh_token: string | undefined = result.body.refresh_token;
  return {
    accessToken: access_token !== undefined ? access_token : null,
    refreshToken: refresh_token !== undefined ? refresh_token : null,
  };
};

export const login = async (code: string) => {
  const payload = {
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    code,
    grant_type: 'authorization_code',
    scope: 'read:profile write:profile',
  };
  return authCall(payload);
};

export const refresh = async () => {
  const refreshToken = getRefreshToken(store.getState());
  if (refreshToken === null) return;
  const payload = {
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'read:profile write:profile',
  };
  try {
    const { accessToken, refreshToken } = await authCall(payload);
    if (accessToken === null) {
      store.dispatch(userLoggedOut());
    } else {
      store.dispatch(userLoggedIn({ accessToken, refreshToken }));
    }
  } catch (error) {
    store.dispatch(userLoggedOut());
  }
};
