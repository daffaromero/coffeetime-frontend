import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { menuListReducer, menuDetailsReducer } from "./reducers/menuReducers";
import { cartReducer } from "./reducers/cartReducers";
import { userLoginReducer, userRegisterReducer, userDetailsReducer,userUpdateProfileReducer } from "./reducers/userReducers";

const reducer = combineReducers({
  productList: menuListReducer,
  productDetails: menuDetailsReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  cart: cartReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cart: { cartItems: cartItemsFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
