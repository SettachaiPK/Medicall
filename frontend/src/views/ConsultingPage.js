import { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import MeetingSummaryConsultant from "../components/MeetingSummaryConsultant";
import MeetingSummaryCustomer from "../components/MeetingSummaryCustomer";
import CallConsultant from "../components/CallConsultant";
import CallCustomer from "../components/CallCustomer";

function ConsultingPage(props) {
  const { step } = useParams();
  //const [step, setStep] = useState(0);
  const role = "consultant";

  return (
    <div>
      {step === "0" && (
        <>
          {role === "customer" && <CallCustomer />}
          {role === "consultant" && <CallConsultant />}
        </>
      )}
      {step === "1" && <>{role === "customer" && <CallCustomer />}</>}
      {step === "2" && (
        <>
          {role === "customer" && <MeetingSummaryCustomer />}
          {role === "consultant" && <MeetingSummaryConsultant />}
        </>
      )}
    </div>
  );
}

ConsultingPage.defaultProps = {};
ConsultingPage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(ConsultingPage);
