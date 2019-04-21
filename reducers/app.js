import { handleActions } from 'redux-actions';

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
  console.log('app', userInfo)
dispatch({ type: 'app/set/userInfo', payload: { userInfo } })
}
