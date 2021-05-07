export const state = {
  login: {
    accessToken: 'someAccessToken',
    refreshToken: 'someRefreshToken',
    isLogged: false,
    afterAuthAction: { followCause: null, redirectTo: null },
  },
  cause: {
    ids: [],
    causes: {},
    numberOfCauses: null,
    inCreationCause: undefined,
    statistics: null,
    causeSupportModal: null,
  },
  coalition: {
    ids: [],
    coalitions: {},
  },
  snackbar: {
    snackbarConfig: undefined,
  },
  user: {
    currentUser: undefined,
  },
};
