import { CartModel, OrderModel } from "../models";
import {
  CART_ADD,
  CART_DELETE,
  CART_INCREASE,
  CART_INIT,
  CART_LOCATION_EDIT,
  CART_ORDER_DELETE,
} from "../actions/types";

const initialState = new CartModel();
let tempOrders;

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_INIT:
      return action.payload;
    case CART_ADD:
      tempOrders = [...state.orders];
      for (let index = 0; index < tempOrders.length; index++) {
        const element = tempOrders[index];
        if (String(action.payload.storeID) === String(element.storeID)) {
          element.storeName = action.payload.storeName;
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
    case CART_INCREASE:
      tempOrders = [...state.orders];
      tempOrders[action.payload.orderIndex].items[
        action.payload.itemIndex
      ].amount = action.payload.value;
      return { ...state, orders: tempOrders };
    case CART_DELETE:
      tempOrders = [...state.orders];
      if (tempOrders[action.payload.orderIndex].items.length <= 1) {
        tempOrders.splice(action.payload.orderIndex, 1);
        return { ...state, orders: tempOrders };
      } else {
        tempOrders[action.payload.orderIndex].items.splice(
          action.payload.itemIndex,
          1
        );
        return { ...state, orders: tempOrders };
      }
    case CART_LOCATION_EDIT:
      return { ...state, deliveryLocation: action.payload };
    case CART_ORDER_DELETE:
      tempOrders = [...state.orders];
      for (let index = 0; index < tempOrders.length; index++) {
        const element = tempOrders[index];
        if (String(action.payload.storeID) === String(element.storeID)) {
          if (element.items.length <= action.payload.items.length) {
            // if no items left in this store remove this store
            tempOrders.splice(index, 1);
          } else {
            for (
              let itemIndex = 0;
              itemIndex < element.items.length;
              itemIndex++
            ) {
              const item = element.items[itemIndex];

              for (
                let payloadItemIndex = 0;
                payloadItemIndex < action.payload.items.length;
                payloadItemIndex++
              ) {
                const payloadItem = action.payload.items[payloadItemIndex];
                if (String(payloadItem.productID) === String(item.productID)) {
                  element.items.splice(itemIndex, 1);
                }
              }
            }
          }
        }
      }
      return { ...state, orders: tempOrders };
    default:
      return state;
  }
};

export default cartReducer;
