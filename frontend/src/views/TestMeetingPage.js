import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { SocketContext } from "../helpers/Context_ref";
import moment from "moment";
import Box from "@mui/material/Box";
import {
  Grid,
  Paper,
  Button,
} from "@material-ui/core";

function TestMeetingPage({ user: { roles } }) {
  const navigate = useNavigate();
  const { jobID } = useParams();
  const {
    myVideo,
    userVideo,
    stream,
    call,
    leaveCall,
    isReceivingCall,
    leaveCallRef,
    callAccepted,
    destinationReady,
  } = useContext(SocketContext);
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [meetEndDate, setMeetEndDate] = useState(null);
  let timerHandle;

  const toggleCam = () => {
    if (myVideo.current.srcObject.getVideoTracks()[0].enabled === true) {
      myVideo.current.srcObject.getVideoTracks().forEach((element) => {
        element.enabled = false;
      });
    } else {
      myVideo.current.srcObject.getVideoTracks().forEach((element) => {
        element.enabled = true;
      });
    }
  };

  useEffect(() => {
    console.log("isReceivingCall", isReceivingCall);
    if (isReceivingCall) {
      setStep(0);
    }
  }, [isReceivingCall]);
  useEffect(() => {
    console.log("callAccepted", callAccepted);
  }, [callAccepted]);

  useEffect(() => {
    if (callAccepted && destinationReady) {
    }
  }, [callAccepted, destinationReady]);

  useEffect(async () => {
    if (call.meetStartDate && call.reservePeriod_m) {
      const endDate = moment(call.meetStartDate).add(
        call.reservePeriod_m,
        "minutes"
      );
      await setMeetEndDate(endDate);
      timerHandle = await setInterval(() => {
        setTimeLeft(endDate.diff(moment(), "seconds"));
      }, 1000);
    }
    return () => clearInterval(timerHandle);
  }, [call.meetStartDate, call.reservePeriod_m]);

  useEffect(() => {
    // call.meetStartDate = Date.now();
    // call.reservePeriod_m = 15;
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {step === 0 && (
        <>
          {call.role === "customer" && (
            <>Consultant name {call.destinationName}</>
          )}
          <Grid container>
            {callAccepted && isReceivingCall && (
              <Paper>
                <Grid item xs={6} md={4}>
                  <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    hidden={call.type !== "video"}
                    style={{ maxWidth: 400 }}
                  />
                </Grid>
              </Paper>
            )}
            {stream && (
              <Paper>
                <Grid item xs={4} md={3}>
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    hidden={call.type !== "video"}
                    style={{ maxWidth: 200 }}
                  />
                </Grid>
                {call.type !== "video" && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => toggleCam()}
                  >
                    toggle cam
                  </Button>
                )}

                {call.type === "voice" && <>voice call</>}
              </Paper>
            )}
            Started time: {moment(call.meetStartDate).format("hh:mm:ss a")}
            End time: {moment(meetEndDate).format("hh:mm:ss a")}
            Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60} m
          </Grid>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            ref={leaveCallRef}
            onClick={() => {
              leaveCall();
              setStep(1);
            }}
          >
            end call
          </Button>
        </>
      )}
      {step === 1 && <>summary page</>}
    </Box>
  );
}

TestMeetingPage.defaultProps = {};
TestMeetingPage.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(TestMeetingPage);
