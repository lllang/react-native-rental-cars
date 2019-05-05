import { handleActions } from 'redux-actions';
import { post } from '../utils/request'

const initState = {
  position: {},
  userInfo: {},
  selected: {},
}

export const appReducer = handleActions({
  'app/set/position': (state, { payload }) => ({
    ...state, ...payload,
  }),
  'app/set/userInfo': (state, { payload }) => ({
    ...state, ...payload,
  }),
  'app/set/selected': (state, { payload }) => ({
    ...state, ...payload,
  })
}, initState);

export const updatePosition = (position) => (dispatch) => {
  dispatch({type: 'app/set/position', payload: { position } })
}

export const updateUserInfo = (userInfo) => (dispatch) => {
  dispatch({ type: 'app/set/userInfo', payload: { userInfo } })
}

export const updateSelected = (selected) => (dispatch) => {
  dispatch({ type: 'app/set/selected', payload: { selected } })
}

export const getUserInfo = (token) => async (dispatch) => {
  const { data } = await post(`/app/user/getUserInfo`, {
    token
  })
  if (data && data.success) {
    const userInfo = {...data.data, token}
    dispatch({ type: 'app/set/userInfo', payload: { userInfo } })
  }
}
