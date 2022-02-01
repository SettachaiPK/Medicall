import * as authService from "../service/auth.service";
import { USER_OTP_UPDATE, USER_SIGNIN } from "./types";

export const actionRequestOTP = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.requestOTP(payload);
    await console.log(data);
    await dispatch(reducerUpdateOTP(data));
    return true;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionVerifyOTP = (payload) => async (dispatch) => {
  console.log('actionVerifyOTP');
  console.log(payload);
  try {
    const { data } = await authService.verifyOTP(payload);
    console.log(data);
    if (data.status === "active") {
      await dispatch(reducerSignIn(data));
    }
    return data.status;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const handleSignIn = async (data) => {};

export const reducerUpdateOTP = (payload) => ({
  type: USER_OTP_UPDATE,
  payload,
});
export const reducerSignIn = (payload) => ({
  type: USER_SIGNIN,
  payload,
});
