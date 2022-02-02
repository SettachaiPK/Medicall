import { UserModel } from "../models";
import { USER_SIGNIN, USER_SIGNOUT } from "../actions/types";

const initialState = new UserModel();

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN:
      return action.payload;
    case USER_SIGNOUT:
      return new UserModel();
    default:
      return state;
  }
};

export default userReducer;
