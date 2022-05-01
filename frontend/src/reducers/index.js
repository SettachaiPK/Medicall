import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import authReducer from "./auth.reducer";
import consultantReducer from "./consultant.reducer";
import consultingReducer from "./consulting.reducer";
import recommendedProductsReducer from "./recommendedProducts.reducer";
import cartReducer from "./cart.reducer";
import appointmentsReducer from "./appointments.reducer";

export default combineReducers({
  user: userReducer,
  auth: authReducer,
  consultant: consultantReducer,
  consulting: consultingReducer,
  recommendedProducts: recommendedProductsReducer,
  cart: cartReducer,
  appointments: appointmentsReducer,
});
