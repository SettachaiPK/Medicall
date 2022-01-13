import qs from "qs";
import httpClient from "./httpClient.service";
import { server } from "./constants.service";

export function signIn(formData) {
  let userInfo = {};
  const Axiosmodel = server.SIGN_IN;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "POST",
      url: Axiosmodel.url,
      config: Axiosmodel,
      data: qs.stringify(formData),
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
