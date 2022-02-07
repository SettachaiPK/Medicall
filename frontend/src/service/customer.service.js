import httpClient from "./httpClient.service";
import { server } from "./constants.service";

export function getOccupation() {
  const Axiosmodel = server.occupation;

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

export function getDepartment(occupation) {
  const Axiosmodel = server.department;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url,
      config: Axiosmodel,
      withCredentials: true,
      params: { occupation: occupation },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}