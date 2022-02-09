import { ConsultantDetailModel } from "../models";
import {
  CONSULTANT_FETCH_DETAIL,
  CONSULTANT_FETCH_STATUS,
} from "../actions/types";

const initialState = new ConsultantDetailModel();

const consultantReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSULTANT_FETCH_DETAIL:
      return action.payload;
    case CONSULTANT_FETCH_STATUS:
      return { ...state, onlineStatus: action.payload };
    default:
      return state;
  }
};

export default consultantReducer;
