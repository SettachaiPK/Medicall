import { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../helpers/Context";
import PropTypes from "prop-types";
import { CircularProgress, Button, Box, Paper, Grid } from "@mui/material";

//import { alertChange } from '../actions/alert.actions';

function AlertPopup(props) {
  const {
    userVideo,
    stream,
    call,
    answerCall,
    me,
    leaveCall,
    callUser,
    getMediaDevice,
    isReceivingCall,
    callAccepted,
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
  return (
    <>
      <div className={`blind-fold ${loading ? "active" : ""}`}>
        <div className="wrapper">
          <CircularProgress size="55px" thickness={4.4} />
        </div>
      </div>
      <div
        className={`blind-fold ${
          // isReceivingCall && !callAccepted ? "active" : ""
          "active"
        }`}
      >
        <div className="wrapper">
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Box>
              <Paper>
                <h1>Meeting is ready!</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate(`/meeting/${call.jobID}`);
                    answerCall();
                  }}
                >
                  ACCEPT
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
