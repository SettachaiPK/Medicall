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
export function getStoreDetail() {
  const Axiosmodel = server.PHARMACY_DETAIL;

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
export function addProduct(data) {
  const Axiosmodel = server.PHARMACY_ADD_PRODUCT;

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

export function editProduct(data) {
  const Axiosmodel = server.PHARMACY_ADD_PRODUCT;
  return new Promise((resolve, reject) => {
    httpClient({
      method: "PUT",
      url: Axiosmodel.url,
      config: Axiosmodel,
      withCredentials: true,
      data,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function confirmSend(data) {
  const Axiosmodel = server.PHARMACY_CONFIRM_SEND;

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

export function deleteProduct(productID) {
  const Axiosmodel = server.PHARMACY_DELETE;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "DELETE",
      url: Axiosmodel.url + `/${productID}`,
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
