import { Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CallComponent from "./CallComponent";
import { Box } from "@mui/system";
import { pink } from "@mui/material/colors";

function CallCustomer(props) {
  return (
    <div>
      <CallComponent jobID={props.jobID} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          pt: "2%",
          pb: "2%",
        }}
      >
        <Typography sx={{ color: pink[200], fontSize: 20 }}>
          เวลาเริ่มต้น: {props.consulting.meetStartDate}
        </Typography>
        <Typography sx={{ color: pink[200], fontSize: 20 }}>
          เวลาสิ้นสุด: {props.consulting.meetEndDate}
        </Typography>
        <Typography sx={{ color: pink[200], fontSize: 20 }}>
          เวลาทั้งหมด: {props.consulting.reservePeriod_m}
        </Typography>
      </Box>
    </div>
  );
}

CallCustomer.defaultProps = {};
CallCustomer.propTypes = {
  consulting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  consulting: state.consulting,
});

export default connect(mapStateToProps, {})(CallCustomer);
