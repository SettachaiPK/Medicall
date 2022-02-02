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
  try {
    const { data } = await authService.verifyOTP(payload);
    if (data.status === "active") {
      console.log(data);
      await dispatch(reducerSignIn(data));
      localStorage.setItem(
        `${process.env.REACT_APP_PREFIX}_USER`,
        JSON.stringify(data)
      );
    }
    return data.status;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionVerifyLogIn = () => async (dispatch) => {
  try {
    let user = await localStorage.getItem(
      `${process.env.REACT_APP_PREFIX}_USER`
    );
    console.log(user);
    if (user) {
      await dispatch(reducerSignIn(JSON.parse(user)));
    } else {
      const { data: user } = await authService.userDetail();
      await dispatch(reducerSignIn(user));
      localStorage.setItem(
        `${process.env.REACT_APP_PREFIX}_USER`,
        JSON.stringify(user)
      );
    }
  } catch (error) {
    console.log(error.message);
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
