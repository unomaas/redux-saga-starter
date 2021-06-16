import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
// Adding in Saga effects:
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

const firstReducer = (state = 0, action) => {
  if (action.type === 'BUTTON_ONE') {
    console.log('firstReducer state', state);
    console.log('Button 1 was clicked!');
    return state + 1;
  }
  return state;
};

const secondReducer = (state = 100, action) => {
  if (action.type === 'BUTTON_TWO') {
    console.log('secondReducer state', state);
    console.log('Button 2 was clicked!');
    return state - 1;
  }
  return state;
};

const elementListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_ELEMENTS':
      return action.payload;
    default:
      return state;
  }
};

// this is the saga that will watch for actions
function* watcherSaga() {
  // FETCH ELEMENTS action in our watcher:
  yield takeEvery('FETCH_ELEMENTS', fetchElements);
  yield takeEvery('ADD_ELEMENT', addElement);
}

// POST/Add needs an action for the payload:
// POST body NEEDS to be an object, so we wrapped it as object in App.jsx payload:
function* addElement(action) {
  try {
    // This is how we POST in saga:
    yield axios.post('/api/element', action.payload)
    // Need to do a GET after the above POST:
    yield put({type: 'FETCH_ELEMENTS'})
  } catch (error) {
    console.error('In addElement, error:', error);
  }

  // axios.post('/api/element', {newElement}).then(() => {
  //   getElements();
  //   setNewElement('');
  // })
  //   .catch(error => {
  //     console.log('error with element get request', error);
  //   });
};


// Worker generator.  Watcher looks for actions, starts workers:
function* fetchElements() {
  try {
    // Does get request:
    const response = yield axios.get('api/element') // SAME RESPONSE AS .THEN
    console.log(response.data);
    // Put effect in Saga is AKA dispatch... frustrating! 
    yield put({ type: 'SET_ELEMENTS', payload: response.data });
  } catch (error) {
    console.error('In fetchElements, error:', error);
  }

  // axios.get('/api/element').then(response => {
  //   dispatch({ type: 'SET_ELEMENTS', payload: response.data });
  // })
  //   .catch(error => {
  //     console.log('error with element get request', error);
  //   });
};


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
  // This function is our first reducer
  // reducer is a function that runs every time an action is dispatched
  combineReducers({
    firstReducer,
    secondReducer,
    elementListReducer,
  }),
  applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
