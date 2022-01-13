import { UserModel } from "../models";
import { USER_SIGNIN } from "../actions/types";

const initialState = new UserModel();

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
