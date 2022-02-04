import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { pink, grey } from "@mui/material/colors";
import PhoneInput from "react-phone-input-2";

function LoginPopup({ onSubmit }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleSubmit = () => {
    onSubmit({ phoneNumber });
  };
  return (
    <>
      <h1 className="head-popup">เข้าสู่ระบบ</h1>
      <DialogContent sx={{ px: 25, py: 3 }}>
        {/* <PhoneInput
          sx={{ width: 1 / 2 }}
          placeholder="หมายเลขโทรศัพท์"
          inputStyle={{
            borderColor: props.touched && props.error && "red",
          }}
          {...props}
        />
        {props.touched && props.error && (
          <p
            style={{ color: "red" }}
            className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-filled MuiFormHelperText-marginDense"
          >
            {props.error}
          </p>
        )} */}
        <PhoneInput
          sx={{ width: 1 / 2 }}
          placeholder="หมายเลขโทรศัพท์"
          value={phoneNumber}
          onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />
      </DialogContent>
      <DialogActions
        sx={{ m: "auto", pb: 10, maxWidth: "lg", fullWidth: true }}
      >
        <div style={{
            paddingBottom:"2rem",
          }}>
        <Button
          sx={{
            m: "auto",
            background: pink[100],
            color: grey[50],
            width: 480,
            height: 45,
            fontWeight: 900,
            fontSize: 20,
          }}
          onClick={handleSubmit}
        >
          เช้าสู่ระบบ
        </Button>
        </div>
      </DialogActions>
    </>
  );
}
export default LoginPopup;
