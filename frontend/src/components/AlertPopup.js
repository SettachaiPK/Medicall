import { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../helpers/Context";
import PropTypes from "prop-types";
import { CircularProgress, Button, Box, Paper, Grid } from "@mui/material";

//import { alertChange } from '../actions/alert.actions';

function AlertPopup(props) {
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
    callUser,
    getMediaDevice,
  } = useContext(SocketContext);
  const navigate = useNavigate();
  const loading = false;
  // const classActive = () => {
  //   if(props.alert.status) return 'active';
  //   else return '';
  // };
  // const classType = () => {
  //   if(props.alert.type) {
  //     if(props.alert.type === 'Info') return 'info';
  //     else if(props.alert.type === 'Success') return 'success';
  //     else if(props.alert.type === 'Warning') return 'warning';
  //     else if(props.alert.type === 'Danger') return 'danger';
  //   }
  //   return '';
  // };

  useEffect(() => {
    if (call.isReceivingCall) {
      getMediaDevice();
    }
  }, [call.isReceivingCall]);
  return (
    <>
      <div className={`blind-fold ${loading ? "active" : ""}`}>
        <div className="wrapper">
          <CircularProgress size="55px" thickness={4.4} />
        </div>
      </div>
      <div
        className={`blind-fold ${
          call.isReceivingCall && !callAccepted ? "active" : ""
        }`}
      >
        <div className="wrapper">
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Box>
              <Paper>
                <h1>{call.name} is calling:</h1>
                <Paper>
                  <Grid item xs={12} md={6}>
                    <video playsInline muted ref={myVideo} autoPlay />
                  </Grid>
                </Paper>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate(`/test-meeting`);
                    answerCall();
                  }}
                >
                  Answer
                </Button>
              </Paper>
            </Box>
          </div>
        </div>
      </div>
      {/* <div className={`alert-popup ${classActive()} ${classType()}`}>
        <div className="wrapper">
          <div className="text-container">
            <h6 className="ls-0">{props.alert.type}</h6>
            <p className="ls-0">{props.alert.message}</p>
            {Object.keys(props.alert.errors).length? (
              <ul>
                {Object.keys(props.alert.errors).map((k, i) => (
                  <li key={i} className="ls-0">{props.alert.errors[k]}</li>
                ))} 
              </ul>
            ): (<></>)}
          </div>
        </div>
      </div> */}
    </>
  );
}

AlertPopup.defaultProps = {};
// AlertPopup.propTypes = {
// 	alertChange: PropTypes.func.isRequired
// };

const mapStateToProps = (state) => ({
  alert: state.alert,
});

//export default connect(mapStateToProps, {alertChange})(AlertPopup);
export default connect(mapStateToProps)(AlertPopup);
