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
export const actionGetStoreDetail = () => async () => {
  try {
    const { data } = await pharmacyService.getStoreDetail();
    return data;
  } catch (error) {
    console.log(error.response.data.message || error.message);
    return [];
  }
};
  export const actionAddProduct = (payload) => async () => {
    try {
      const { data } = await pharmacyService.addProduct(payload);
      return data;
    } catch (error) {
      console.log(error.response.data.message || error.message);
      return [];
    }
  };

  export const actionEditProduct = (payload) => async () => {
    try {
      const { data } = await pharmacyService.editProduct(payload);
      return data;
    } catch (error) {
      console.log(error.response.data.message || error.message);
      return [];
    }
  };

  export const actionConfirmSend = (payload) => async () => {
    try {
      const { data } = await pharmacyService.confirmSend(payload);
      return data;
    } catch (error) {
      console.log(error.response.data.message || error.message);
      return [];
    }
  };

  export const actionDeleteProduct = (payload) => async () => {
    try {
      const { data } = await pharmacyService.deleteProduct(payload);
      return data;
    } catch (error) {
      console.log(error.response.data.message || error.message);
      return [];
    }
  };