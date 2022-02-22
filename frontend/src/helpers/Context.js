import { createContext, useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io(`${process.env.REACT_APP_API_URL}`);

const ContextProvider = ({ user: { userID }, children }) => {
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [call, setCall] = useState({
    callAccepted: false,
    destinationSocket: null,
    destinationName: "",
    destinationReady: false,
    signal: null,
    type: null,
    jobID: null,
    role: null,
  });
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const [initiator, setInitiator] = useState(false);

  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("userReady", () => {
      console.log("destination ready");
      setCall((prev) => {
        return { ...prev, destinationReady: true };
      });
    });

    socket.on(
      "invite",
      ({ jobID, role, type, destinationName, destinationSocket }) => {
        if (!call.isReceivingCall) {
          setCall({
            ...call,
            jobID: jobID,
            role: role,
            type: type,
            destinationName: destinationName,
            destinationSocket: destinationSocket,
            isReceivingCall: true,
          });
          setIsReceivingCall(true);
        }
      }
    );

    socket.on("callUser", ({ from, signalData }) => {
      console.log("incoming call");
      setCall({ ...call, callAccepted: true });

      const peer = new Peer({ initiator: false, trickle: false, stream });

      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: from });
      });

      peer.on("stream", (currentStream) => {
        console.log("currentStream", currentStream);
        userVideo.current.srcObject = currentStream;
      });

      peer.signal(signalData);

      connectionRef.current = peer;
    });

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

  // useEffect(() => {
  //   console.log(call);
  // }, [call]);

  useEffect(() => {
    if (stream && call.destinationReady && call.role === "customer") {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: call.destinationSocket,
          signalData: data,
          from: me,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log("currentStream", currentStream);
        userVideo.current.srcObject = currentStream;
      });

      socket.on("callAccepted", (signal) => {
        console.log("call accepted", signal);
        setCall({ ...call, callAccepted: true });

        peer.signal(signal);
      });

      connectionRef.current = peer;
    }
  }, [call.destinationReady, stream]);

  // useEffect(() => {
  //   if (stream) {
  //     setDeviceReady(true);
  //   }
  // }, [stream]);

  const answerCall = () => {
    setCall({
      ...call,
      callAccepted: true,
    });
    console.log("answer call", call);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
        socket.emit("userReady", { to: call.destinationSocket });
      });
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });


    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
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

  const acceptCall = async () => {
    const peer = await new Peer({ initiator, trickle: false, stream });
    await console.log("answerCall", peer);

    await peer.on("signal", (data) => {
      console.log("emit signal");
      socket.emit("answerCall", { signal: data, to: call.destination });
    });

    await peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    await socket.on("callAccepted", (signal) => {
      console.log("callAccepted");

      peer.signal(signal);
    });

    connectionRef.current = await peer;
  };

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
    setCallEnded(true);
    setInitiator(false);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        answerCall,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        leaveCall,
        isReceivingCall,
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
