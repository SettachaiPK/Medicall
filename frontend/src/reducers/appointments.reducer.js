import { BOOKED_SCHEDULE_FETCH, SCHEDULE_FETCH } from "../actions/types";
import { AppointmentsModel } from "../models/consultant/appointment.model";

const initialState = new AppointmentsModel();

const appointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKED_SCHEDULE_FETCH:
      return { ...state, booked: action.payload };
    case SCHEDULE_FETCH:
      return { ...state, schedule: action.payload };
    default:
      return state;
  }
};

export default appointmentsReducer;
