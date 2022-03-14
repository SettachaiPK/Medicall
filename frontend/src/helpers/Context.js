import { createContext, useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { CallModel } from "../models";
import {
  actionIncomingCall,
  actionDestinationReady,
  actionStartMeeting,
  actionLeaveCall,
  actionEndMeeting,
} from "../actions/consulting.action";
import { actionSubmitAdvice } from "../actions/consultant.action";

const SocketContext = createContext();

const socket = io(`${process.env.REACT_APP_API_URL}`, {
  autoConnect: false,
});

const ContextProvider = (props) => {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const socketAcceptCall = () => {
    socket.emit("acceptCall", {
      to: props.consulting.destination,
      jobID: props.consulting.jobID,
    });
  };

  const handleLeaveCall = () => {
    socket.emit("leaveCall", {
      to: props.consulting.destination,
    });
    props.actionEndMeeting(props.consulting.jobID);
    leaveCall();
  };

  const leaveCall = () => {
    if (props.consulting.role === "consultant") {
      props.actionSubmitAdvice({
        jobID: props.consulting.jobID,
        advice: props.consulting.advice,
      });
    }
    props.actionLeaveCall(props.consulting.role);
  };

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    socket.on("invite", (jobDetail) => {
      props.incomingCall(jobDetail);
    });
  }, []);

  useEffect(() => {
    socket.on("acceptCall", (jobID) => {
      if (jobID === props.consulting.jobID) {
        props.destinationReady();
      }
    });
    socket.on("leaveCall", () => {
      leaveCall();
    });
  }, [props.consulting.jobID]);

  useEffect(() => {
    if (props.user.userID) {
      socket.auth = { userID: props.user.userID };
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [props.user.userID]);

  useEffect(() => {
    console.log(
      props.consulting.isSelfReady,
      props.consulting.isDestinationReady
    );
    if (
      props.consulting.isSelfReady &&
      props.consulting.isDestinationReady &&
      props.consulting.role === "customer"
    ) {
      console.log("start connect streaming");
      props.actionStartMeeting(props.consulting.jobID);
    }
  }, [props.consulting.isSelfReady, props.consulting.isDestinationReady]);

  return (
    <SocketContext.Provider
      value={{
        myVideo,
        userVideo,
        socketAcceptCall,
        handleLeaveCall,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

ContextProvider.defaultProps = {};
ContextProvider.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
  consulting: state.consulting,
});

export default connect(mapStateToProps, {
  incomingCall: actionIncomingCall,
  destinationReady: actionDestinationReady,
  actionStartMeeting: actionStartMeeting,
  actionEndMeeting: actionEndMeeting,
  actionLeaveCall: actionLeaveCall,
  actionSubmitAdvice: actionSubmitAdvice,
})(ContextProvider);

export { SocketContext };
