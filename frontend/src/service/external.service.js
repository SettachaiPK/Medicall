import httpClient from "./httpClient.service";
import { server } from './constants.service';

export function sentTranferRequestService(data) {
  const Axiosmodel = server.SENT_TRANFER_REQUEST;
  return new Promise((resolve, reject) => {
    httpClient({
      method: "POST",
      url: Axiosmodel.url,
      config: Axiosmodel,
      data: data,
      withCredentials: true,
    })
    .then(res => {  
      resolve(res.data);
    })
    .catch(err => {  
      reject(err);
    });
  });
}

export function verifyTranferRequestService(token) {
  const Axiosmodel = server.VERIFY_TRANFER_REQUEST;
  Axiosmodel.changeParam(`/${token}`);
  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url,
      config: Axiosmodel,
      withCredentials: true,
    })
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {  
      reject(err);
    });
  });
}
