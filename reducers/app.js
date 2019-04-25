import { handleActions } from 'redux-actions';
import { post } from '../utils/request'

const initState = {
  position: {},
  userInfo: {},
}

export const appReducer = handleActions({
  'app/set/position': (state, { payload }) => ({
    ...state, ...payload,
  }),
  'app/set/userInfo': (state, { payload }) => ({
    ...state, ...payload,
  })
}, initState);

export const updatePosition = (position) => (dispatch) => {
  dispatch({type: 'app/set/position', payload: { position } })
}

export const updateUserInfo = (userInfo) => (dispatch) => {
  dispatch({ type: 'app/set/userInfo', payload: { userInfo } })
}

export const getUserInfo = (token) => async (dispatch, getState) => {
  const data = await post(`/app/user/getUserInfo`, {
    token
  })
  console.log(data);
  if (data && data.success) {
    const userInfo = {...getState().userInfo, ...data.data}
    dispatch({ type: 'app/set/userInfo', payload: { userInfo } })
  }
}
