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
  ///auth///
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
  ///user///
  avatar: new AxiosModel({ url: `user/avatar` }),
  ///customer///
  occupation: new AxiosModel({ url: `customer/occupation` }),
  department: new AxiosModel({ url: `customer/department` }),
  customerConsultantService: new AxiosModel({
    url: `customer/consult-service`,
  }),
  CONSULT_JOB: new AxiosModel({
    url: `customer/consult-job`,
  }),
  meetStart: new AxiosModel({
    url: `customer/consult-job/start`,
  }),
  meetEnd: new AxiosModel({
    url: `customer/consult-job/end`,
  }),
  ///consultant///
  consultantService: new AxiosModel({ url: `consultant/service` }),
  editConsultantStatus: new AxiosModel({ url: `consultant/online-status` }),
  CONSULT_JOB_CONSULTANT: new AxiosModel({
    url: `consultant/consult-job`,
  }),
  CONSULT_JOB_GET_CUSTOMER: new AxiosModel({
    url: `consultant/customer`,
  }),
  CONSULTANT_SUBMIT_ADVICE: new AxiosModel({
    url: `consultant/meetingEnd`,
  }),
  ///delete///
  confirmPayment: new AxiosModel({ url: `external/confirm-payment` }),
};
