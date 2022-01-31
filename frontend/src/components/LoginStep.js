import * as React from "react";
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

function LoginStep(props) {
  const [step, setStep] = useState(0);
  const handleStepChange = (input) => {
    setStep(input);
  };
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };


  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        {step === 0 && (
          <>
            <LoginPopup handleStepChange={handleStepChange}/>
          </>
        )}
        {step === 1 && (
          <>
            <OTPpopup handleStepChange={handleStepChange}/>
          </>
        )}
        {step === 2 && <>
          <PolicyPopup handleStepChange={handleStepChange}/>
        </>}
        {step === 3 && <>
          <CommonRegistPopup handleStepChange={handleStepChange}/>
        </>}

      </Dialog>
    </div>
  );
}
export default LoginStep;
