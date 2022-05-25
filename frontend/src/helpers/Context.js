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
  actionChangeStream,
} from "../actions/consulting.action";

const SocketContext = createContext();

let api_url = "";
if (process.env.NODE_ENV !== "production") {
  api_url = process.env.REACT_APP_API_URL;
} else {
  api_url = process.env.REACT_APP_PRODUCTION_API_URL;
}
const socket = io(`${api_url}`, {
  autoConnect: false,
});

const ContextProvider = (props) => {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const stream = props.consulting.stream;

  /* Handle accept call button press */
  const socketAcceptCall = () => {
    /* Get media device resource */
    navigator.mediaDevices
      .getUserMedia({
        video: props.consulting.type === "video" ? true : false,
        audio: true,
      })
      .then((currentStream) => {
        props.actionChangeStream(currentStream);
        myVideo.current.srcObject = currentStream;
        /* Emit accept call to server */
        socket.emit("acceptCall", {
          to: props.consulting.destination,
          jobID: props.consulting.jobID,
        });
      });
  };

  const handleLeaveCall = async () => {
    /* Call api to confirm call ended */
    await props.actionEndMeeting(props.consulting.jobID);
    /* Emit leave call to server */
    await socket.emit("leaveCall", {
      to: props.consulting.destination,
    });
    /* Ahead to leave call process */
    await leaveCall();
  };

  const leaveCall = () => {
    console.log("myVideo", myVideo.current);
    /* After calling */
    /* If cam still active */
    if (myVideo.current) {
      /* Stop media device */
      myVideo.current.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    // Process to leave call
    props.actionLeaveCall();
  };

  const startStream = () => {
    /* Start streaming process */
    console.log("firing stream here", stream);
    /* Create new peer for customer */
    const peer = new Peer({ initiator: true, trickle: false, stream });

    /* Send stream signal to consultant */
    peer.on("signal", (data) => {
      socket.emit("fireStream", {
        userToCall: props.consulting.destination,
        signalData: data,
      });
    });

    /* Set userVideo ref to be destination stream */
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    /* Prepare for returning stream */
    socket.on("receiveStream", ({ signalData }) => {
      console.log("customer receive stream signal", signalData);
      peer.signal(signalData);
    });

    connectionRef.current = peer;
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
    /* When both self and destination ready */
    /* Customer start streaming after his cam ready */
    if (
      props.consulting.isSelfReady &&
      props.consulting.isDestinationReady &&
      props.consulting.role === "customer" &&
      stream
    ) {
      console.log("start connect streaming");
      startStream();
      props.actionStartMeeting(props.consulting.jobID);
    }
  }, [
    props.consulting.isSelfReady,
    props.consulting.isDestinationReady,
    stream,
  ]);

  /* Get ready for receive incoming stream (consultant) */
  useEffect(() => {
    if (stream && props.consulting.role == "consultant") {
      console.log("new stream");
      socket.on("receiveStream", ({ signalData }) => {
        console.log("consultant receive stream signal", signalData);
        /* Create new peer for consultant */
        const peer = new Peer({ initiator: false, trickle: false, stream });

        /* Send stream signal to destination */
        peer.on("signal", (data) => {
          socket.emit("fireStream", {
            userToCall: props.consulting.destination,
            signalData: data,
          });
        });

        /* Store destination signal to userVideo */
        peer.on("stream", (currentStream) => {
          userVideo.current.srcObject = currentStream;
        });

        peer.signal(signalData);

        connectionRef.current = peer;
      });
    }
  }, [stream]);

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
  recommendedProducts: state.recommendedProducts,
});

export default connect(mapStateToProps, {
  incomingCall: actionIncomingCall,
  destinationReady: actionDestinationReady,
  actionStartMeeting: actionStartMeeting,
  actionEndMeeting: actionEndMeeting,
  actionLeaveCall: actionLeaveCall,
  actionChangeStream: actionChangeStream,
})(ContextProvider);

export { SocketContext };
