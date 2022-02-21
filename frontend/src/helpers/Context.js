import { createContext, useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io(`${process.env.REACT_APP_API_URL}`);
//const socket = io('https://warm-wildwood-81069.herokuapp.com');

const ContextProvider = ({ user: { userID }, children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [destinationID, setDestinationID] = useState(null);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => {
      console.log("setting me ", id);
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      console.log("incoming call");
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("makeCall", ({ id }) => {
      setDestinationID(id);
    });
  }, []);

  useEffect(() => {
    if (userID) {
      socket.emit("user", { userID: userID });
    }
  }, [userID]);

  useEffect(() => {
    if (destinationID) {
      console.log("calling");
      const peer = new Peer({ initiator: true, trickle: false, stream });
      console.log("me", me);
      peer.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: destinationID,
          signalData: data,
          from: me,
          name,
        });
      });

      peer.on("stream", (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });

      socket.on("callAccepted", (signal) => {
        console.log("callAccepted");
        setCallAccepted(true);

        peer.signal(signal);
      });

      connectionRef.current = peer;
    }
  }, [destinationID]);

  const answerCall = () => {
    console.log("answerCall", call);
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = useCallback(
    (id) => {
      console.log("calling");
      const peer = new Peer({ initiator: true, trickle: false, stream });
      console.log("me", me);
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
        console.log("callAccepted");
        setCallAccepted(true);

        peer.signal(signal);
      });

      connectionRef.current = peer;
    },
    [me, name]
  );

  const leaveCall = () => {
    setCallEnded(true);

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
        callUser,
        leaveCall,
        answerCall,
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
