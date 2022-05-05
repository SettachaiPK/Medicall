import { CONSULTANT_SCHEDULE_FETCH } from "../actions/types";
import { ConsultantScheduleModel } from "../models/user/consultantSchedule.model";

const initialState = new ConsultantScheduleModel();

const customerBookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSULTANT_SCHEDULE_FETCH:
      return { ...state, consultantSchedule: action.payload };
    default:
      return state;
  }
};

export default customerBookingReducer;
