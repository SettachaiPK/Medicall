import {
  CONSULTING_ACCEPT_CALL,
  CONSULTING_INCOMING_CALL,
  CONSULTING_DESTINATION_READY,
  CONSULTING_START_TIMER,
  CONSULTING_LEAVE_CALL,
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

export const actionLeaveCall = () => async (dispatch) => {
  try {
    await dispatch(reducerLeaveCall());
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
};

export const actionEndMeeting = (jobID) => async () => {
  try {
    await customerService.meetEnd({ jobID });
  } catch (error) {
    console.log(error.response.data.message || error.message);
  }
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
