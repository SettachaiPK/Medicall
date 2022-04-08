import { CartModel, OrderModel } from "../models";
import { CART_ADD, CART_INIT } from "../actions/types";

const initialState = new CartModel();

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_INIT:
      return action.payload;
    case CART_ADD:
      console.log(action.payload);
      let tempOrders = [...state.orders];
      for (let index = 0; index < tempOrders.length; index++) {
        const element = tempOrders[index];
        if (String(action.payload.storeID) === String(element.storeID)) {
          element.storeName = action.payload.storeName;
          console.log("first loop", element);

          for (let indexj = 0; indexj < element.items.length; indexj++) {
            if (
              String(element.items[indexj].productID) ===
              String(action.payload.item.productID)
            ) {
              element.items[indexj].amount =
                parseInt(element.items[indexj].amount) +
                parseInt(action.payload.item.amount);

              return { ...state, orders: tempOrders };
            }
          }
          element.items.push(action.payload.item);
          return { ...state, orders: tempOrders };
        }
      }
      let newOrder = new OrderModel({
        storeID: action.payload.storeID,
        storeName: action.payload.storeName,
      });
      newOrder.items.push(action.payload.item);
      tempOrders.push(newOrder);
      return { ...state, orders: tempOrders };
    default:
      return state;
  }
};

export default cartReducer;
