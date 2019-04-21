import thunk from 'redux-thunk';
import { reducers } from '../reducers';
import { applyMiddleware, compose, createStore } from 'redux';

let composer;
if (__DEV__ && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
  composer = compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
} else {
  composer = compose(applyMiddleware(thunk));
}

const store = createStore(reducers, composer);

export default store;