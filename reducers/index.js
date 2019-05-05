import { combineReducers } from 'redux';
import { appReducer, updatePosition, updateUserInfo, getUserInfo, updateSelected } from './app';

export const reducers = combineReducers({
  app: appReducer
});
export const actions = {
  updatePosition,
  updateUserInfo,
  getUserInfo,
  updateSelected,
};
