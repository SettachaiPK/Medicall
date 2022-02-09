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
  signUpCustomer: new AxiosModel({ url: `auth/signup/customer` }),
  signUpConsultant: new AxiosModel({ url: `auth/signup/consultant` }),
  signUpPhamarcy: new AxiosModel({ url: `auth/signup/phamarcy` }),
  CHECK_REFRESH_TOKEN: new AxiosModel({ url: `auth/checktoken` }),
  checkPendingConsultant: new AxiosModel({
    url: `auth/pending-consultant`,
  }),
  checkPendingPhamarcy: new AxiosModel({
    url: `auth/pending-phamarcy`,
  }),
  occupation: new AxiosModel({ url: `customer/occupation` }),
  department: new AxiosModel({ url: `customer/department` }),
  customerConsultantService: new AxiosModel({
    url: `customer/consult-service`,
  }),
  consultantService: new AxiosModel({ url: `consultant/service` }),
  editConsultantStatus: new AxiosModel({ url: `consultant/online-status` }),
};
