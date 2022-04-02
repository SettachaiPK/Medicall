import * as pharmacyService from "../service/pharmacy.service";

export const actionGetProducts = () => async () => {
  try {
    const { data } = await pharmacyService.getProducts();
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};
export const actionGetOrders = () => async () => {
  try {
    const { data } = await pharmacyService.getOrders();
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};
export const actionGetOrderDetail = (orderID) => async () => {
  try {
    const { data } = await pharmacyService.getOrderDetail(orderID);
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};
