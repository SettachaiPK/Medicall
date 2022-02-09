import * as consultantService from "../service/consultant.service";
import { CONSULTANT_FETCH_DETAIL,CONSULTANT_FETCH_STATUS } from "./types";

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


export const reducerFetchConsultantDetail = (payload) => ({
  type: CONSULTANT_FETCH_DETAIL,
  payload,
});
export const reducerFetchConsultantStatus = (payload) => ({
  type: CONSULTANT_FETCH_STATUS,
  payload,
});
