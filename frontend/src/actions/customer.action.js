import * as customerService from "../service/customer.service";

export const actionGetOccupations = () => async (dispatch) => {
  try {
    const { data } = await customerService.getOccupation();
    return data;
  } catch (error) {
    alert(error.response.data.message || error.message);
    return []
  }
};

export const actionGetDepartment = (occupation) => async (dispatch) => {
    try {
      const { data } = await customerService.getDepartment(occupation);
      return data;
    } catch (error) {
      alert(error.response.data.message || error.message);
      return []
    }
  };