import {
  CONSULTING_ACCEPT_CALL,
  CONSULTING_INCOMING_CALL,
  CONSULTING_DESTINATION_READY,
  CONSULTING_START_TIMER,
  CONSULTING_LEAVE_CALL,
  CONSULTING_LEAVE_CALL_CUSTOMER,
  ON_CHANG_ADVICE,ON_CHANG_STEP
} from "./types";
import * as customerService from "../service/customer.service";
import moment from "moment";

export const actionIncomingCall = (data) => async (dispatch) => {
  try {
    await dispatch(reducerIncomingCall(data));
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionAcceptCall = () => async (dispatch) => {
  try {
    await dispatch(reducerAcceptCall());
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionDestinationReady = () => async (dispatch) => {
  try {
    await dispatch(reducerDestinationReady());
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionStartMeeting = (jobID) => async (dispatch) => {
  try {
    const {
      data: { result },
    } = await customerService.meetStart({ jobID });
    let start = moment(result.meetStartDate);
    console.log(start.format("hh:mm A"));
    console.log(parseInt(result.reservePeriod_m));
    console.log(
      start.add(parseInt(result.reservePeriod_m), "minutes").format("hh:mm A")
    );
    await dispatch(
      reducerStartTimer({
        meetStartDate: moment(result.meetStartDate).format("hh:mm A"),
        meetEndDate: moment(result.meetStartDate)
          .add(parseInt(result.reservePeriod_m), "minutes")
          .format("hh:mm A"),
        reservePeriod_m: result.reservePeriod_m,
      })
    );
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionLeaveCall = (role) => async (dispatch) => {
  if (role === "consultant") {
    dispatch(reducerLeaveCall());
  } else if (role === "customer") {
    dispatch(reducerLeaveCallCustomer());
  }
};

export const actionEndMeeting = (jobID) => async () => {
  try {
    await customerService.meetEnd({ jobID });
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionChangeAdvice = (payload) => (dispatch) => {
  dispatch(reducerChangeAdvice(payload));
};

export const actionChangeStep = (payload) => (dispatch) => {
  dispatch(reducerChangeStep(payload));
};

export const reducerIncomingCall = (payload) => ({
  type: CONSULTING_INCOMING_CALL,
  payload,
});

export const reducerAcceptCall = () => ({
  type: CONSULTING_ACCEPT_CALL,
});

export const reducerDestinationReady = () => ({
  type: CONSULTING_DESTINATION_READY,
});

export const reducerStartTimer = (payload) => ({
  type: CONSULTING_START_TIMER,
  payload,
});

export const reducerLeaveCall = () => ({
  type: CONSULTING_LEAVE_CALL,
});

export const reducerLeaveCallCustomer = () => ({
  type: CONSULTING_LEAVE_CALL_CUSTOMER,
});

export const reducerChangeAdvice = (payload) => ({
  type: ON_CHANG_ADVICE,
  payload,
});

export const reducerChangeStep = (payload) => ({
  type: ON_CHANG_STEP,
  payload,
});
