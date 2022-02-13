import { UserModel } from "../models";
import { USER_SIGNIN, USER_SIGNOUT, USER_FETCH_AVATAR } from "../actions/types";

const initialState = new UserModel();

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN:
      return action.payload;
    case USER_SIGNOUT:
      return new UserModel();
    case USER_FETCH_AVATAR:
      return { ...state, avatar: action.payload };
    default:
      return state;
  }
};

export default userReducer;
