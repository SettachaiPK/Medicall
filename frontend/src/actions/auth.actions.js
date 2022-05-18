import * as authService from "../service/auth.service";
import {
  USER_OTP_UPDATE,
  USER_SIGNIN,
  USER_SIGNOUT,
  USER_FETCH_AVATAR,
} from "./types";

export const actionRequestOTP = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.requestOTP(payload);
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

export const actionSignUpCustomer = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.signUpCustomer(payload);
    dispatch(actionVerifyLogIn());
    //alert(data.message);
    return data.message;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionSignUpConsultant = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.signUpConsultant(payload);
    alert(data.message);
    return data.message;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionSignUpPhamarcy = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.signUpPhamarcy(payload);
    alert(data.message);
    return data.message;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionVerifyLogIn = () => async (dispatch) => {
  try {
    const user = await localStorage.getItem(
      `${process.env.REACT_APP_PREFIX}_USER`
    );
    if (user) {
      await dispatch(reducerSignIn(JSON.parse(user)));
    } else {
      const res = await authService.userDetail();
      if (res.status === 200) {
        await dispatch(reducerSignIn(res.data));
        localStorage.setItem(
          `${process.env.REACT_APP_PREFIX}_USER`,
          JSON.stringify(res.data)
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const actionLogout = () => async (dispatch) => {
  try {
    await authService.signOut();
    localStorage.removeItem(`${process.env.REACT_APP_PREFIX}_USER`);
    await dispatch(reducerSignOut());
  } catch (error) {
    alert(error.response.data.message || error.message);
  }
};

export const actionCheckPendingConsultant = () => async (dispatch) => {
  try {
    const data = await authService.checkPendingConsultant();
    return data;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionCheckPendingPhamarcy = () => async (dispatch) => {
  try {
    const { pending } = await authService.checkPendingPhamarcy();
    return pending;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return false;
  }
};

export const actionChangeAvatar = (payload) => async (dispatch) => {
  try {
    const { image } = await authService.changeAvatar(payload);
    let localstor = JSON.parse(
      localStorage.getItem(`${process.env.REACT_APP_PREFIX}_USER`)
    );
    localstor.avatar = image;
    localStorage.setItem(
      `${process.env.REACT_APP_PREFIX}_USER`,
      JSON.stringify(localstor)
    );
    await dispatch(reducerChangeAvatar(image));
  } catch (error) {
    alert(error.response.data.message || error.message);
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
export const reducerSignOut = () => ({
  type: USER_SIGNOUT,
});
export const reducerChangeAvatar = (payload) => ({
  type: USER_FETCH_AVATAR,
  payload,
});
