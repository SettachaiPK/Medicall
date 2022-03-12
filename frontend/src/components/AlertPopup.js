import { useContext } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { SocketContext } from "../helpers/Context";
import { CircularProgress, Button, Box, Paper } from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import { actionAcceptCall } from "../actions/consulting.action";

//import { alertChange } from '../actions/alert.actions';

function AlertPopup(props) {
  const context = useContext(SocketContext);
  const navigate = useNavigate();
  const loading = false;

  return (
    <>
      <div className={`blind-fold ${loading ? "active" : ""}`}>
        <div className="wrapper">
          <CircularProgress size="55px" thickness={4.4} />
        </div>
      </div>
      <div
        className={`blind-fold ${
          props.consulting.isReceivingCall && !props.consulting.isCalling
            ? "active"
            : ""
        }`}
      >
        <div className="wrapper">
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ width: "30rem", height: "200%" }}>
              <Paper
                sx={{
                  height: "15rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2 className="describe_label" style={{ marginTop: "10%" }}>
                  การปรึกษาของคุณพร้อมแล้ว....
                </h2>
                <Button
                  sx={{
                    m: "auto",
                    mt: "1%",
                    background: pink[100],
                    color: grey[50],
                    fontWeight: 900,
                    fontSize: 20,
                  }}
                  variant="contained"
                  onClick={() => {
                    navigate(`/consulting/${props.consulting.jobID}`);
                    props.actionAcceptCall();
                    context.socketAcceptCall();
                  }}
                >
                  ยอมรับ
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
AlertPopup.propTypes = {
  actionAcceptCall: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired,
  consulting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  alert: state.alert,
  consulting: state.consulting,
});

//export default connect(mapStateToProps, {alertChange})(AlertPopup);
export default connect(mapStateToProps, { actionAcceptCall: actionAcceptCall })(
  AlertPopup
);
