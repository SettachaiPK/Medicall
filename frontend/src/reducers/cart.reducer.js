import { CartModel } from "../models";
import { CART_INIT } from "../actions/types";

const initialState = new CartModel();

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_INIT:
      return action.payload;
    default:
      return state;
  }
};

export default cartReducer;
