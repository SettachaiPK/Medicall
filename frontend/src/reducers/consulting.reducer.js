import { ConsultingModel } from "../models";
import {
  CONSULTING_ACCEPT_CALL,
  CONSULTING_INCOMING_CALL,
  CONSULTING_DESTINATION_READY,
  CONSULTING_START_TIMER,
  CONSULTING_LEAVE_CALL,
  ON_CHANG_ADVICE,
  CONSULTING_LEAVE_CALL_CUSTOMER,
  ON_CHANG_STEP,
} from "../actions/types";

const initialState = new ConsultingModel();
let tempState;

const consultingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSULTING_INCOMING_CALL:
      console.log(action.payload);
      return {
        ...state,
        destination: action.payload.destination,
        type: action.payload.type,
        jobID: action.payload.jobID,
        role: action.payload.role,
        isReceivingCall: true,
      };
    case CONSULTING_ACCEPT_CALL:
      return {
        ...state,
        step: 0,
        isReceivingCall: false,
        isCalling: true,
        isSelfReady: true,
      };
    case CONSULTING_DESTINATION_READY:
      return { ...state, isDestinationReady: true };
    case CONSULTING_START_TIMER:
      return {
        ...state,
        reservePeriod_m: action.payload.reservePeriod_m,
        meetStartDate: action.payload.meetStartDate,
        meetEndDate: action.payload.meetEndDate,
      };
    case CONSULTING_LEAVE_CALL:
      tempState = new ConsultingModel();
      return { ...tempState, step: 2, role: state.role };
    case CONSULTING_LEAVE_CALL_CUSTOMER:
      tempState = new ConsultingModel();
      return { ...tempState, step: 1, role: state.role };
    case ON_CHANG_ADVICE:
      return { ...state, advice: action.payload };
    case ON_CHANG_STEP:
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

export default consultingReducer;
