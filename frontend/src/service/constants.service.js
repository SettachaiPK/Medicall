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
  userDetail: new AxiosModel({ url: `auth` }),
  SIGN_OUT: new AxiosModel({ url: `auth/logout` }),
  requestOTP: new AxiosModel({ url: `auth/requestOTP` }),
  verifyOTP: new AxiosModel({ url: `auth/verifyOTP` }),
  signUpCustomer: new AxiosModel({ url: `auth/signUpCustomer` }),
  signUpConsultant: new AxiosModel({ url: `auth/signUpConsultant` }),
  CHECK_REFRESH_TOKEN: new AxiosModel({ url: `auth/checktoken` }),
  checkPendingConsultant: new AxiosModel({
    url: `auth/pendingConsultant`,
  }),
  occupation: new AxiosModel({ url: `customer/occupation` }),
  department: new AxiosModel({ url: `customer/department` }),
};
