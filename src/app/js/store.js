import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { connect, Provider } from "react-redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { combineForms, createForms } from "react-redux-form";
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import { signInReducer, signUpReducer, setPasswordReducer, sessionData } from "./Reducers/UserAuthenticationReducers";
import { sagas } from "./Sagas/index";

const sagaMiddleware = createSagaMiddleware();

let middleware = applyMiddleware(routerMiddleware(browserHistory), logger, thunk, promise(), sagaMiddleware);

if(process.env.NODE_ENV !== 'production') {
  middleware = compose(middleware, (window.devToolsExtension ? window.devToolsExtension() : compose));  
}

const store = createStore(
	combineReducers({
		...createForms({
			signInStore: signInReducer,
			signUpStore: signUpReducer,
			setPasswordStore: setPasswordReducer
		}),
		routing: routerReducer,
		sessionData: sessionData
	}),
	{},
	middleware
);

sagaMiddleware.run(sagas);

export default store;