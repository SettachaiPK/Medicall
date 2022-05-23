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
import {
  actionSubmitAdvice,
  actionSubmitRecommendedProducts,
} from "../actions/consultant.action";

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

  const handleLeaveCall = () => {
    /* Emit leave call to server */
    socket.emit("leaveCall", {
      to: props.consulting.destination,
    });
    /* Call api to confirm call ended */
    props.actionEndMeeting(props.consulting.jobID);
    /* Ahead to leave call process */
    leaveCall();
  };

  const leaveCall = async () => {
    console.log("myVideo", myVideo.current);
    /* After calling */
    /* If cam still active */
    if (myVideo.current) {
      /* Stop media device */
      myVideo.current.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    /* If user is consultant */
    if (props.consulting.role === "consultant") {
      /* Save advice to server */
      await props.actionSubmitAdvice({
        jobID: props.consulting.jobID,
        advice: props.consulting.advice,
      });
      /* Save recommend product to server */
      await props.actionSubmitRecommendedProducts({
        jobID: props.consulting.jobID,
        recommendedProducts: props.recommendedProducts.selectedProducts.map(
          (product) => {
            return { productID: product.productID, amount: product.amount };
          }
        ),
      });
    }
    await props.actionLeaveCall(props.consulting.role);
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

  /* When both self and destination ready */
  /* Start streaming */
  useEffect(() => {
    console.log(
      props.consulting.isSelfReady,
      props.consulting.isDestinationReady
    );
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
  actionSubmitAdvice: actionSubmitAdvice,
  actionSubmitRecommendedProducts: actionSubmitRecommendedProducts,
  actionChangeStream: actionChangeStream,
})(ContextProvider);

export { SocketContext };
