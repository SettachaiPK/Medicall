import { RecommendedProductsModel } from "../models";
import {
  RECOMMENDED_PRODUCTS_FETCH_STATUS,
  RECOMMENDED_PRODUCTS_FETCH_PRODUCTS,
  RECOMMENDED_PRODUCTS_FETCH_AMOUNT,
  RECOMMENDED_PRODUCTS_SELECT,
  RECOMMENDED_PRODUCTS_REMOVE,
} from "../actions/types";

const initialState = new RecommendedProductsModel();

const recommendedProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECOMMENDED_PRODUCTS_FETCH_PRODUCTS:
      return { ...state, products: action.payload };
    case RECOMMENDED_PRODUCTS_FETCH_STATUS:
      return { ...state, loading: action.payload };
    case RECOMMENDED_PRODUCTS_FETCH_AMOUNT:
      let newProducts = state.products.map((product, index) => {
        return index === action.payload.index
          ? { ...product, amount: action.payload.amount }
          : product;
      });
      return { ...state, products: newProducts };
    case RECOMMENDED_PRODUCTS_SELECT:
      let newSelectedProducts = [...state.selectedProducts];
      for (let index = 0; index < newSelectedProducts.length; index++) {
        const element = newSelectedProducts[index];
        if (element.productID === action.payload.productID) {
          element.amount =
            parseFloat(element.amount) + parseFloat(action.payload.amount);
          return {
            ...state,
            selectedProducts: newSelectedProducts,
          };
        }
      }
      return {
        ...state,
        selectedProducts: state.selectedProducts.concat([action.payload]),
      };
    case RECOMMENDED_PRODUCTS_REMOVE:
      let newSelected = [...state.selectedProducts];
      newSelected.splice(action.payload, 1);
      return {
        ...state,
        selectedProducts: newSelected,
      };
    default:
      return state;
  }
};

export default recommendedProductsReducer;
