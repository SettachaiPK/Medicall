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

function OTPpopup(props) {
  const handleStepChange = () => {
    props.handleStepChange(2);
  };
  const phone_no = "no.";
  return (
          <>
            <h1 className="head-popup">กรอกรหัสยืนยัน</h1>
            <label className="describe_label">รหัสยืนยันจะถูกส่งไปที่เบอร์ {phone_no}</label>
            <DialogContent sx={{ pb: 0,maxWidth: "lg", fullWidth: true}}>
              <TextField
                sx={{ width: 500,m: "auto",px: 3}}
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
              sx={{ m: "auto", pb: 5, maxWidth: "lg", fullWidth: true, display: "flex",flexDirection: "column"}}
            >
            <label style={ {'padding-bottom': "25px",color: "#a7a7a7",'text-decoration': "underline"}}>ส่งรหัสยืนยันอีกครั้ง </label>
              <Button
                sx={{
                  m: "auto",
                  background: pink[100],
                  color: grey[50],
                  width: 500,
                  height: 45,
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
export default OTPpopup;
