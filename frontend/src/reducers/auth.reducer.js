import { AuthModel } from "../models";
import { USER_OTP_UPDATE } from "../actions/types";

const initialState = new AuthModel();

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_OTP_UPDATE:
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
