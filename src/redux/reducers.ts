/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.ts, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { reducer as login } from './Login';
import { reducer as cause } from './Cause';
import { reducer as coalition } from './Coalition';
import { reducer as snackbar } from './Snackbar';
import { reducer as user } from './User';
import { reducer as event } from './Events';

const causePersistConfig = {
  key: 'cause',
  storage: storage,
  whitelist: ['inCreationCause'],
};

export default combineReducers({
  login,
  cause: persistReducer(causePersistConfig, cause),
  coalition,
  snackbar,
  user,
  event,
});
