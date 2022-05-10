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

export function getJobDetail(jobID) {
  const Axiosmodel = server.CONSULT_JOB_CONSULTANT;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url + `/${jobID.toString()}`,
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
export function getCustomerDetail(jobID) {
  const Axiosmodel = server.CONSULT_JOB_GET_CUSTOMER;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url + `/${jobID.toString()}`,
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
export function submitAdvice(data) {
  const Axiosmodel = server.CONSULTANT_SUBMIT_ADVICE;

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
export function submitRecommendedProducts(data) {
  const Axiosmodel = server.CONSULTANT_SUBMIT_RECOMMENDED_PRODUCTS;

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

export function getSummaryConsultant(jobID) {
  const Axiosmodel = server.CONSULTANT_GET_SUMMARY;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url + `/${jobID.toString()}`,
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

export function getProductsConsultant(data) {
  const Axiosmodel = server.CONSULTANT_GET_PRODUCTS;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "GET",
      url: Axiosmodel.url + `?search=${data.toString()}`,
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

export function getBookedSchedule() {
  const Axiosmodel = server.CONSULTANT_GET_BOOKED_SCHEDULE;

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
export function getSchedule() {
  const Axiosmodel = server.CONSULTANT_GET_SCHEDULE;

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
export function deleteSchedule(scheduleID) {
  const Axiosmodel = server.CONSULTANT_DELETE_SCHEDULE;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "DELETE",
      url: Axiosmodel.url.replace(":scheduleID", scheduleID),
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
export function patchSchedule(scheduleID, data) {
  const Axiosmodel = server.CONSULTANT_DELETE_SCHEDULE;

  return new Promise((resolve, reject) => {
    httpClient({
      method: "PATCH",
      url: Axiosmodel.url.replace(":scheduleID", scheduleID),
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
export function createSchedule(data) {
  const Axiosmodel = server.CONSULTANT_GET_SCHEDULE;

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
