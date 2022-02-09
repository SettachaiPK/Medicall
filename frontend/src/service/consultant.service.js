import httpClient from "./httpClient.service";
import { server } from "./constants.service";

export function getConsultantService() {
  const Axiosmodel = server.consultantService;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url,
      withCredentials: true,
      config: Axiosmodel,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function editConsultantService(data) {
  const Axiosmodel = server.consultantService;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "POST",
      url: Axiosmodel.url,
      withCredentials: true,
      config: Axiosmodel,
      data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function editConsultantStatus(data) {
  const Axiosmodel = server.editConsultantStatus;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "POST",
      url: Axiosmodel.url,
      withCredentials: true,
      config: Axiosmodel,
      data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}