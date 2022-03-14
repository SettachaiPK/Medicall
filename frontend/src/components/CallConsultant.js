import { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CallComponent from "./CallComponent";
import CustomerCallDetails from "./CustomerCallDetails";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { actionChangeAdvice } from "../actions/consulting.action";

const height = "10rem";

function CallConsultant(props) {
  const onChangeInput = (e) => {
    console.log('onChangeInput');
    props.actionChangeAdvice(e);
  };

  return (
    <div
      style={{
        display: "flex",
        alignitems: "stretch",
        margin: "auto",
        "justify-content": "center",
      }}
    >
      <CustomerCallDetails />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: "63rem" }}>
          <CallComponent jobID={props.jobID} advice={props.consulting.advice} />
        </Box>
        <TextField
          inputProps={{
            style: {
              height,
              width: "50rem",
            },
          }}
          sx={{ mt: 3 }}
          multiline
          rows={4}
          id="outlined-basic"
          label="คำแนะนำจากคุณ"
          variant="outlined"
          value={props.consulting.advice}
          onChange={(e) => onChangeInput(e.target.value)}
        />
      </Box>
    </div>
  );
}

CallConsultant.defaultProps = {};
CallConsultant.propTypes = {
  consulting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  consulting: state.consulting,
});

export default connect(mapStateToProps, {
  actionChangeAdvice: actionChangeAdvice,
})(CallConsultant);
