import { OrderItemModel } from "../models";
import * as customerService from "../service/customer.service";
import { CART_INIT } from "./types";

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
    console.log("init carts", cart);
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
    const item = OrderItemModel(payload);
    console.log("item carts", item);
  } catch (error) {
    console.log(error);
  }
};

export const reducerInitCart = (payload) => ({
  type: CART_INIT,
  payload,
});
