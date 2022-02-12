import * as React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { pink, grey } from "@mui/material/colors";

function OTPpopup({ auth: { phoneNumber, ref }, onSubmit }) {
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
    onSubmit({ password, phoneNumber });
  };
  const _handleTextFieldChange = (e) => {
    setPassword(e.target.value);
  };
  return (
    <>
      <h1 className="head-popup">กรอกรหัสยืนยัน</h1>
      <label className="describe_label">
        รหัสผ่านจะถูกส่งไปที่เบอร์ {phoneNumber}
      </label>
      <label className="describe_label">รหัสยืนยัน {ref}</label>
      <DialogContent sx={{ pb: 0, maxWidth: "lg", fullWidth: true }}>
        {/* <TextField
          sx={{ width: 500, m: "auto", px: 3 }}
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
        )} */}
        <TextField
          sx={{ width: 500, m: "auto", px: 3 }}
          id="outlined-password-input"
          type="password"
          value={password}
          onChange={_handleTextFieldChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          m: "auto",
          pb: 5,
          maxWidth: "lg",
          fullWidth: true,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label
          style={{
            paddingBottom: "4%",
            color: "#a7a7a7",
            textDecoration: "underline",
          }}
        >
          ส่งรหัสยืนยันอีกครั้ง{" "}
        </label>
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
          onClick={handleSubmit}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(OTPpopup);
