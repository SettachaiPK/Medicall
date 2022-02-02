import { AxiosModel } from "../models/index";

export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

export const API_URL = `${process.env.REACT_APP_API_URL}apis/`;

export const server = {
  SIGN_IN: new AxiosModel({ url: `auth/signin` }),
  SIGN_OUT: new AxiosModel({ url: `auth/signout` }),
  requestOTP: new AxiosModel({ url: `auth/requestOTP` }),
  verifyOTP: new AxiosModel({ url: `auth/verifyOTP` }),
  userDetail: new AxiosModel({ url: `auth` }),
};
