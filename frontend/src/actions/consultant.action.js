import { RecommendedProductsModel } from "../models";
import { AppointmentItemModel } from "../models/consultant/appointment.model";
import * as consultantService from "../service/consultant.service";
import {
  BOOKED_SCHEDULE_FETCH,
  CONSULTANT_FETCH_DETAIL,
  CONSULTANT_FETCH_STATUS,
  RECOMMENDED_PRODUCTS_FETCH_AMOUNT,
  RECOMMENDED_PRODUCTS_FETCH_PRODUCTS,
  RECOMMENDED_PRODUCTS_FETCH_STATUS,
  RECOMMENDED_PRODUCTS_REMOVE,
  RECOMMENDED_PRODUCTS_SELECT,
  SCHEDULE_DELETE,
  SCHEDULE_FETCH,
} from "./types";

export const actionGetServiceDetail = () => async (dispatch) => {
  try {
    const { data } = await consultantService.getConsultantService();
    await dispatch(reducerFetchConsultantDetail(data));
    return true;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return false;
  }
};

export const actionEditServiceDetail = (payload) => async (dispatch) => {
  try {
    await consultantService.editConsultantService(payload);
    await dispatch(actionGetServiceDetail());
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionEditServiceStatus = (payload) => async (dispatch) => {
  try {
    await consultantService.editConsultantStatus(payload);
    await dispatch(reducerFetchConsultantStatus(payload.onlineStatus));
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionGetJobDetailConsultant = (jobID) => async (dispatch) => {
  try {
    const { data } = await consultantService.getJobDetail(jobID);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionGetCustomerDetail = (jobID) => async (dispatch) => {
  try {
    const { data } = await consultantService.getCustomerDetail(jobID);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionSubmitAdvice = (payload) => async (dispatch) => {
  try {
    console.log(payload)
    const { data } = await consultantService.submitAdvice(payload);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};
export const actionSubmitRecommendedProducts = (payload) => () => {
  try {
    consultantService.submitRecommendedProducts(payload);
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionGetSummaryConsultant = (jobID) => async () => {
  try {
    const { data } = await consultantService.getSummaryConsultant(jobID);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};

export const actionGetProductsConsultant = (payload) => async (dispatch) => {
  try {
    await dispatch(reducerFetchRecommendedProductsStatus(true));
    const { data } = await consultantService.getProductsConsultant(payload);
    await dispatch(
      reducerFetchRecommendedProducts(
        data.map((product) => {
          return { ...product, amount: 1 };
        })
      )
    );
    await dispatch(reducerFetchRecommendedProductsStatus(false));
  } catch (error) {
    await dispatch(reducerFetchRecommendedProductsStatus(false));
    console.log(error);
  }
};

export const actionFetchProductAmount = (payload) => (dispatch) => {
  try {
    dispatch(reducerFetchRecommendedProductsAmount(payload));
  } catch (error) {
    console.log(error);
  }
};

export const actionSelectProduct = (payload) => (dispatch) => {
  try {
    dispatch(reducerSelectProduct(payload));
  } catch (error) {
    console.log(error);
  }
};

export const actionRemoveProduct = (payload) => (dispatch) => {
  try {
    dispatch(reducerRemoveProduct(payload));
  } catch (error) {
    console.log(error);
  }
};

export const actionFetchBookedSchedule = () => async (dispatch) => {
  try {
    const {
      data: { result },
    } = await consultantService.getBookedSchedule();
    const appointments = result.map(
      ({
        scheduleID,
        communicationChannel,
        firstName,
        lastName,
        startDate,
        endDate,
        scheduleStatus,
      }) =>
        new AppointmentItemModel(
          scheduleID,
          `ให้คำปรึกษาคุณ ${firstName} ${lastName} ประเภทสนทนา${
            communicationChannel == "voice" ? "เสียง" : "วิดีโอ"
          }`,
          new Date(startDate),
          new Date(endDate),
          scheduleStatus
        )
    );
    dispatch(reducerFetchBookedSchedule(appointments));
  } catch (error) {
    console.log(error);
  }
};

export const actionFetchSchedule = () => async (dispatch) => {
  try {
    const {
      data: { result },
    } = await consultantService.getSchedule();
    const appointments = result.map(
      ({ scheduleID, startDate, endDate, scheduleStatus }) =>
        new AppointmentItemModel(
          scheduleID,
          scheduleStatus == "booked" ? "ถูกจองแล้ว" : "เปิดให้จอง",
          new Date(startDate),
          new Date(endDate),
          scheduleStatus
        )
    );
    dispatch(reducerFetchSchedule(appointments));
  } catch (error) {
    console.log(error);
  }
};

export const actionDeleteSchedule = (scheduleID) => async (dispatch) => {
  try {
    consultantService.deleteSchedule(scheduleID);
    dispatch(reducerDeleteSchedule(scheduleID));
  } catch (error) {
    console.log(error);
  }
};

export const actionPatchSchedule = (scheduleID, data) => async (dispatch) => {
  try {
    await consultantService.patchSchedule(scheduleID, data);
    await dispatch(actionFetchSchedule());
  } catch (error) {
    console.log(error);
  }
};

export const actionCreateSchedule = (data) => async (dispatch) => {
  try {
    await consultantService.createSchedule(data);
    await dispatch(actionFetchSchedule());
  } catch (error) {
    console.log(error);
  }
};

export const reducerFetchConsultantDetail = (payload) => ({
  type: CONSULTANT_FETCH_DETAIL,
  payload,
});
export const reducerFetchConsultantStatus = (payload) => ({
  type: CONSULTANT_FETCH_STATUS,
  payload,
});
export const reducerFetchRecommendedProducts = (payload) => ({
  type: RECOMMENDED_PRODUCTS_FETCH_PRODUCTS,
  payload,
});
export const reducerFetchRecommendedProductsStatus = (payload) => ({
  type: RECOMMENDED_PRODUCTS_FETCH_STATUS,
  payload,
});

export const reducerFetchRecommendedProductsAmount = (payload) => ({
  type: RECOMMENDED_PRODUCTS_FETCH_AMOUNT,
  payload,
});

export const reducerSelectProduct = (payload) => ({
  type: RECOMMENDED_PRODUCTS_SELECT,
  payload,
});

export const reducerRemoveProduct = (payload) => ({
  type: RECOMMENDED_PRODUCTS_REMOVE,
  payload,
});

export const reducerFetchBookedSchedule = (payload) => ({
  type: BOOKED_SCHEDULE_FETCH,
  payload,
});

export const reducerFetchSchedule = (payload) => ({
  type: SCHEDULE_FETCH,
  payload,
});

export const reducerDeleteSchedule = (payload) => ({
  type: SCHEDULE_DELETE,
  payload,
});
