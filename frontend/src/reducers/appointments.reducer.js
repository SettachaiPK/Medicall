import { BOOKED_SCHEDULE_FETCH, SCHEDULE_DELETE, SCHEDULE_FETCH } from "../actions/types";
import { AppointmentsModel } from "../models/consultant/appointment.model";

const initialState = new AppointmentsModel();

const appointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKED_SCHEDULE_FETCH:
      return { ...state, booked: action.payload };
    case SCHEDULE_FETCH:
      return { ...state, schedule: action.payload };
    case SCHEDULE_DELETE:
      return {
        ...state,
        schedule: state.schedule.filter(
          (appointment) => appointment.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default appointmentsReducer;
