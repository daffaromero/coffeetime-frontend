import {
  MENU_LIST_REQUEST,
  MENU_LIST_SUCCESS,
  MENU_LIST_FAIL,
  MENU_DETAILS_FAIL,
  MENU_DETAILS_SUCCESS,
  MENU_DETAILS_REQUEST,
} from "../constants/menuConstants";

export const menuListReducer = (state = { menus: [] }, action) => {
  switch (action.type) {
    case MENU_LIST_REQUEST:
      return { loading: true, menus: [] };
    case MENU_LIST_SUCCESS:
      return { loading: false, menus: action.payload };
    case MENU_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const menuDetailsReducer = (state = { menu: [] }, action) => {
  switch (action.type) {
    case MENU_DETAILS_REQUEST:
      return { loading: true, menu: [] };
    case MENU_DETAILS_SUCCESS:
      return { loading: false, menu: action.payload };
    case MENU_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
