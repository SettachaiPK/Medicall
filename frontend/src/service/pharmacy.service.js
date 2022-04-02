import httpClient from "./httpClient.service";
import { server } from "./constants.service";

export function getProducts() {
  const Axiosmodel = server.PHARMACY_PRODUCT;

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
export function getOrders() {
  const Axiosmodel = server.PHARMACY_ORDERS;

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
export function getOrderDetail(orderID) {
  const Axiosmodel = server.PHARMACY_ORDER_DETAIL;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url + `/${orderID}`,
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
