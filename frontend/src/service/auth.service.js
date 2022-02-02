import qs from "qs";
import httpClient from "./httpClient.service";
import { server } from "./constants.service";

export function signOut() {
  const Axiosmodel = server.SIGN_OUT;
  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url,
      config: Axiosmodel,
      withCredentials: true,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        reject(err);
      });
  });
}

export function requestOTP(data) {
  const Axiosmodel = server.requestOTP;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "POST",
      url: Axiosmodel.url,
      config: Axiosmodel,
      data: data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function verifyOTP(data) {
  const Axiosmodel = server.verifyOTP;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "POST",
      url: Axiosmodel.url,
      config: Axiosmodel,
      data: data,
      withCredentials: true,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function userDetail() {
  const Axiosmodel = server.userDetail;
  console.log('userDetail');

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url,
      config: Axiosmodel,
      withCredentials: true,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function checkRefreshToken() {
  const Axiosmodel = server.CHECK_REFRESH_TOKEN;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url,
      config: Axiosmodel,
      withCredentials: true,
    })
      .then((res) => {
        // console.log( 'res check refresh : ', res)
        resolve(res);
      })
      .catch((err) => {
        // console.log( 'error check refresh : ', err)
        reject(err);
      });
  });
}
