import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { pink, grey } from "@mui/material/colors";
import PhoneInput from "react-phone-input-2";
import { fontWeight } from "@mui/system";

function PolicyPopup(props) {
  const handleStepChange = () => {
    props.handleStepChange(3);
  };
  const phone_no = "no.";
  return (
          <>
            <h1 className="head-popup">กรอกรหัสยืนยัน</h1>
            <DialogContent sx={{ px: 25, py: 3 }}>
              <TextField
                sx={{ width: 1 }}
                id="outlined-password-input"
                type="password"
                autoComplete="current-password"
                {...props}
              />
              {props.touched && props.error && (
                <p
                  style={{ color: "red" }}
                  className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-filled MuiFormHelperText-marginDense"
                >
                  {props.error}
                </p>
              )}
            </DialogContent>
            <DialogActions
              sx={{ m: "auto", pb: 10, maxWidth: "lg", fullWidth: true }}
            >
              <Button
                sx={{
                  m: "auto",
                  background: pink[100],
                  color: grey[50],
                  fontWeight: 900,
                  fontSize: 20,
                }}
                onClick={handleStepChange}
              >
                ยืนยัน
              </Button>
            </DialogActions>
          </>
  );
}
export default PolicyPopup;
