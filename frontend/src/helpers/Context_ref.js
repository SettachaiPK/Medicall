import { createContext, useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { CallModel } from "../models";

const SocketContext = createContext();

const socket = io(`${process.env.REACT_APP_API_URL}`);

const ContextProvider = ({ user: { userID }, children }) => {
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [destinationReady, setDestinationReady] = useState(false);
  const [call, setCall] = useState(new CallModel());
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const leaveCallRef = useRef();

  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("userReady", () => {
      console.log("destination ready");
      setDestinationReady(true);
    });

    socket.on(
      "invite",
      ({
        jobID,
        role,
        type,
        destinationName,
        destinationSocket,
        reservePeriod_m,
      }) => {
        if (!isReceivingCall) {
          setCall({
            ...call,
            jobID: jobID,
            role: role,
            type: type,
            destinationName: destinationName,
            destinationSocket: destinationSocket,
            reservePeriod_m: reservePeriod_m,
          });
          setIsReceivingCall(true);
        }
      }
    );

    // socket.on(
    //   "makeCall",
    //   ({ id, type, jobID, customerName, consultantName }) => {
    //     console.log("makeCall");
    //     setCall({
    //       isReceivingCall: true,
    //       destination: id,
    //       name: consultantName,
    //       signal: null,
    //       type,
    //       jobID,
    //       isCaller: true,
    //     });
    //     socket.emit("callUser", {
    //       userToCall: id,
    //       from: me,
    //       name: customerName,
    //       type,
    //       jobID,
    //     });
    //     setInitiator(true);
    //   }
    // );
  }, []);

  useEffect(() => {
    if (userID) {
      socket.emit("user", { userID: userID });
    }
  }, [userID]);
  useEffect(() => {
    socket.on("leaveCall", () => {
      console.log("got leave signal", isReceivingCall);
      if (isReceivingCall) {
        console.log("click leave", leaveCallRef.current);
        leaveCallRef.current.click();
      }
    });
  }, [isReceivingCall]);
  useEffect(() => {
    console.log(leaveCallRef.current);
  }, [leaveCallRef]);

  useEffect(() => {
    if (stream) {
      socket.on("callUser", ({ from, signalData }) => {
        console.log("firing stream", stream);
        console.log("incoming call", signalData);
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
          socket.emit("answerCall", {
            signal: data,
            to: from,
            jobID: call.jobID,
          });
        });

        peer.on("stream", (currentStream) => {
          console.log("currentStream", currentStream);
          userVideo.current.srcObject = currentStream;
        });

        peer.signal(signalData);

        connectionRef.current = peer;
      });
    }
  }, [stream]);

  useEffect(() => {
    if (stream && destinationReady && call.role === "customer") {
      console.log("callUser", destinationReady);
      callUser();
    }
  }, [destinationReady, stream]);

  useEffect(() => {
    if (stream && callAccepted) {
      console.log("firing user ready");
      socket.emit("userReady", { to: call.destinationSocket });
    }
  }, [stream]);

  const answerCall = () => {
    setCallAccepted(true);
    console.log("answer call", call);
    navigator.mediaDevices
      .getUserMedia({
        video: call.type === "video" ? true : false,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
        console.log("setting stream");
        myVideo.current.srcObject = currentStream;
      });
  };

  const callUser = () => {
    console.log("firing stream here", stream);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: call.destinationSocket,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (currentStream) => {
      console.log("userVideo", userVideo.current);
      console.log("currentStream", currentStream);
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", ({ signal, meetStartDate }) => {
      console.log("call accepted", signal);
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // useEffect(() => {
  //   if (destinationID) {
  //     console.log("calling");
  //     const peer = new Peer({ initiator: true, trickle: false, stream });
  //     console.log("me", me);
  //     peer.on("signal", (data) => {
  //       socket.emit("callUser", {
  //         userToCall: destinationID,
  //         signalData: data,
  //         from: me,
  //         name,
  //       });
  //     });

  //     peer.on("stream", (currentStream) => {
  //       userVideo.current.srcObject = currentStream;
  //     });

  //     socket.on("callAccepted", (signal) => {
  //       console.log("callAccepted");
  //       setCallAccepted(true);

  //       peer.signal(signal);
  //     });

  //     connectionRef.current = peer;
  //   }
  // }, [destinationID]);

  // const callUser = useCallback(
  //   (id) => {
  //     console.log("calling");
  //     socket.emit("callUser", {
  //       userToCall: id,
  //       from: me,
  //       name,
  //     });
  //     // const peer = new Peer({ initiator: true, trickle: false, stream });
  //     // console.log("me", me);
  //     // peer.on("signal", (data) => {
  //     //   socket.emit("callUser", {
  //     //     userToCall: id,
  //     //     signalData: data,
  //     //     from: me,
  //     //     name,
  //     //   });
  //     // });

  //     // peer.on("stream", (currentStream) => {
  //     //   userVideo.current.srcObject = currentStream;
  //     // });

  //     // socket.on("callAccepted", (signal) => {
  //     //   console.log("callAccepted");
  //     //   setCallAccepted(true);

  //     //   peer.signal(signal);
  //     // });

  //     // connectionRef.current = peer;
  //   },
  //   [me, name]
  // );

  const leaveCall = () => {
    socket.emit("leaveCall", {
      to: call.destinationSocket,
      jobID: call.jobID,
    });
    setIsReceivingCall(false);
    setCall(new CallModel());

    connectionRef.current.destroy();
    setStream(null);
    myVideo.current.srcObject.getTracks().forEach((tracks) => {
      tracks.stop();
    });

    // window.location.reload().then(() => {
    //   console.log("after reload");
    // });
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        answerCall,
        myVideo,
        userVideo,
        stream,
        me,
        leaveCall,
        isReceivingCall,
        callAccepted,
        leaveCallRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ContextProvider);

export { SocketContext };
