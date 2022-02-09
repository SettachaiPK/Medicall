import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import authReducer from "./auth.reducer";
import consultantReducer from "./consultant.reducer";

export default combineReducers({
  user: userReducer,
  auth: authReducer,
  consultant: consultantReducer,
});
