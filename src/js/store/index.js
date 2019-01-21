// src/js/store/index.js
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";
import {getData} from "../actions/index";
import {rebaseApiDataMiddleware} from "../middleware/index";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, storeEnhancers(applyMiddleware(rebaseApiDataMiddleware, thunk))
);
//TODO check if it's ok to call api here
store.dispatch(getData());
export default store;

