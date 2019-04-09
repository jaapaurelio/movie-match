import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { actionTypes } from "./constants";

const initialState = {
  user: {
    name: ""
  }
};

function setUser(state, action) {
  return Object.assign({}, state, {
    user: {
      name: action.user.name
    }
  });
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return setUser(state, action);
    default:
      return state;
  }
};

// ACTIONS

export function initializeStore(initialState = initialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
