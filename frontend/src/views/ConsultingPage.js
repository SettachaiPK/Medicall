import { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import MeetingSummaryConsultant from "../components/MeetingSummaryConsultant";
import MeetingSummaryCustomer from "../components/MeetingSummaryCustomer";
import CallConsultant from "../components/CallConsultant";
import CallCustomer from "../components/CallCustomer";
import { Button } from "@mui/material";

function ConsultingPage(props) {
  const { jobID } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      {props.consulting.step === 0 && (
        <>
          {props.consulting.role === "customer" && <CallCustomer />}
          {props.consulting.role === "consultant" && <CallConsultant />}
        </>
      )}
      {props.consulting.step === 1 && (
        <>{props.consulting.role === "customer" && <CallCustomer />}</>
      )}
      {props.consulting.step === 2 && (
        <>
          {props.consulting.role === "customer" && <MeetingSummaryCustomer />}
          {props.consulting.role === "consultant" && <MeetingSummaryConsultant />}
        </>
      )}
    </div>
  );
}

ConsultingPage.defaultProps = {};
ConsultingPage.propTypes = {
  consulting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ consulting: state.consulting });

export default connect(mapStateToProps, {})(ConsultingPage);
