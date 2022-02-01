import * as React from "react";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { pink, grey } from "@mui/material/colors";
import PhoneInput from "react-phone-input-2";
import LoginPopup from "./LoginPopup";
import { useState } from "react";
import OTPpopup from "./OTPpopup";
import PolicyPopup from "./PolicyPopup";
import CommonRegistPopup from "./CommonRegistPopup";

import { actionRequestOTP, actionVerifyOTP } from "../actions/auth.actions";

function LoginStep(props) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);

  const handleStepChange = (input) => {
    setStep(input);
  };

  const handleClose = () => {
    props.onClose();
    setStep(0);
  };

  const handleRequestOTP = async (data) => {
    const res = await dispatch(actionRequestOTP(data));
    if (res) {
      await handleStepChange(1);
    }
  };
  const handleVerifyOTP = async (data) => {
    const res = await dispatch(actionVerifyOTP(data));
    if (res === "unsigned") {
      await handleStepChange(2);
    } else if (res === "active") {
      await handleClose();
    } else if (res === "inactive") {
      await handleStepChange(0);
    }
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        {step === 0 && (
          <>
            <LoginPopup onSubmit={handleRequestOTP} />
          </>
        )}
        {step === 1 && (
          <>
            <OTPpopup onSubmit={handleVerifyOTP} />
          </>
        )}
        {step === 2 && (
          <>
            <PolicyPopup handleStepChange={handleStepChange} />
          </>
        )}
        {step === 3 && (
          <>
            <CommonRegistPopup handleStepChange={handleStepChange} />
          </>
        )}
      </Dialog>
    </div>
  );
}

export default LoginStep;
