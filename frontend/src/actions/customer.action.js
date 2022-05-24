import { OrderItemModel } from "../models";
import * as customerService from "../service/customer.service";
import {
  CART_ADD,
  CART_DELETE,
  CART_INCREASE,
  CART_INIT,
  CART_LOCATION_EDIT,
  CART_ORDER_DELETE,
  CONSULTANT_SCHEDULE_FETCH,
} from "./types";

export const actionGetOccupations = () => async (dispatch) => {
  try {
    const { data } = await customerService.getOccupation();
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionGetDepartment = (occupation) => async (dispatch) => {
  try {
    const { data } = await customerService.getDepartment(occupation);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionGetJobDetail = (jobID) => async (dispatch) => {
  try {
    const { data } = await customerService.getJobDetail(jobID);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionGetJobSummary = (jobID) => async (dispatch) => {
  try {
    const { data } = await customerService.getJobSummary(jobID);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionGiveReview = (payload) => async (dispatch) => {
  try {
    console.log(payload);
    const { data } = await customerService.giveReview(payload);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const actionInitCart = () => async (dispatch) => {
  try {
    const cart = await localStorage.getItem(
      `${process.env.REACT_APP_PREFIX}_CART`
    );
    if (cart) {
      await dispatch(reducerInitCart(JSON.parse(cart)));
    }
  } catch (error) {
    console.log(error);
  }
};

export const actionSaveCart = (payload) => async () => {
  localStorage.setItem(
    `${process.env.REACT_APP_PREFIX}_CART`,
    JSON.stringify(payload)
  );
};

export const actionAddToCart = (payload) => async (dispatch) => {
  try {
    const item = new OrderItemModel(payload);
    dispatch(
      reducerAddToCart({
        item,
        storeID: payload.storeID,
        storeName: payload.storeName,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const actionCartItemIncrease = (payload) => (dispatch) => {
  try {
    dispatch(reducerCartItemIncrease(payload));
  } catch (error) {
    console.log(error);
  }
};

export const actionCartItemDelete = (payload) => (dispatch) => {
  try {
    dispatch(reducerCartItemDelete(payload));
  } catch (error) {
    console.log(error);
  }
};

export const actionPlaceOrder = (payload) => async (dispatch) => {
  try {
    const { data } = await customerService.placeOrder(payload);
    dispatch(reducerCartLocationEdit(payload.deliveryLocation));
    dispatch(
      reducerCartOrderDelete({ storeID: payload.storeID, items: payload.items })
    );
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const actionFetchConsultantSchedule =
  (consultantID) => async (dispatch) => {
    try {
      const { data } = await customerService.getConsultantSchedule(
        consultantID
      );
      dispatch(reducerFetchConsultantSchedule(data.result));
    } catch (error) {
      console.log(error);
    }
  };

export const reducerInitCart = (payload) => ({
  type: CART_INIT,
  payload,
});
export const reducerAddToCart = (payload) => ({
  type: CART_ADD,
  payload,
});
export const reducerCartItemIncrease = (payload) => ({
  type: CART_INCREASE,
  payload,
});
export const reducerCartItemDelete = (payload) => ({
  type: CART_DELETE,
  payload,
});
export const reducerCartLocationEdit = (payload) => ({
  type: CART_LOCATION_EDIT,
  payload,
});
export const reducerCartOrderDelete = (payload) => ({
  type: CART_ORDER_DELETE,
  payload,
});
export const reducerFetchConsultantSchedule = (payload) => ({
  type: CONSULTANT_SCHEDULE_FETCH,
  payload,
});
