import { useContext, useState } from "react";
import { connect } from "react-redux";
import { SocketContext } from "../helpers/Context";
import Box from "@mui/material/Box";
import {
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Container,
} from "@material-ui/core";

function TestMeetingPage({ user: { roles } }) {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    answerCall,
    setName,
    me,
    leaveCall,
  } = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");
  const turnOffCam = () => {
    myVideo.current.srcObject.getVideoTracks()[0].stop();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        {stream && (
          <Paper>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {name || "Name"}
              </Typography>
              <video playsInline muted ref={myVideo} autoPlay />
            </Grid>
          </Paper>
        )}
        {callAccepted && !callEnded && (
          <Paper>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {call.name || "Name"}
              </Typography>
              <video playsInline ref={userVideo} autoPlay />
            </Grid>
          </Paper>
        )}
      </Grid>
      <Container>
        <Paper elevation={10}>
          <form noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom variant="h6">
                  Account Info
                </Typography>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom variant="h6">
                  Make a call
                </Typography>
                <TextField
                  label="ID to call"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  fullWidth
                />
                {callAccepted && !callEnded ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={leaveCall}
                  >
                    Hang Up
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {}}
                  >
                    Call
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => turnOffCam()}
                >
                  turn off cam
                </Button>
              </Grid>
            </Grid>
          </form>
          {/* {call.isReceivingCall && !callAccepted && (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <h1>{call.name} is calling:</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          )} */}
        </Paper>
        {me}
      </Container>
    </Box>
  );
}

TestMeetingPage.defaultProps = {};
TestMeetingPage.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(TestMeetingPage);
