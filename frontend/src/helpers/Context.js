import { createContext, useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io(`${process.env.REACT_APP_API_URL}`);

const ContextProvider = ({ user: { userID }, children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({
    isReceivingCall: false,
    destination: "",
    name: "",
    type: null,
    signal: null,
    jobID: "",
    isCaller: false,
  });
  const [me, setMe] = useState("");
  const [initiator, setInitiator] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    socket.on("me", (id) => {
      console.log("setting me ", id);
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, type }) => {
      console.log("incoming call");
      setCall({
        isReceivingCall: true,
        destination: from,
        name: callerName,
        signal: null,
        type,
        isCaller: false,
      });
    });

    socket.on(
      "makeCall",
      ({ id, type, jobID, customerName, consultantName }) => {
        console.log("makeCall");
        setCall({
          isReceivingCall: true,
          destination: id,
          name: consultantName,
          signal: null,
          type,
          jobID,
          isCaller: true,
        });
        socket.emit("callUser", {
          userToCall: id,
          from: me,
          name: customerName,
          type,
        });
        setInitiator(true);
      }
    );
  }, []);

  useEffect(() => {
    if (userID) {
      socket.emit("user", { userID: userID });
    }
  }, [userID]);

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

  const getMediaDevice = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log("currentStream", currentStream);
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;

        // myVideo.current.srcObject.getVideoTracks().forEach((track) => {
        //   track.stop();
        // });
      })
      .catch((error) => {
        alert(`Error accessing video devices. ${error.message}`);
      });
  };

  const answerCall = () => {
    console.log("answerCall", call);
    setCallAccepted(true);

    const peer = new Peer({ initiator, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    connectionRef.current = peer;
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
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        leaveCall,
        answerCall,
        getMediaDevice,
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
