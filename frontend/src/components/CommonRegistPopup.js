import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { pink, grey } from "@mui/material/colors";
import PhoneInput from "react-phone-input-2";
import { fontWeight } from "@mui/system";

function CommonRegistPopup(props) {
  const handleStepChange = () => {
    props.handleStepChange(4);
  };
  return (
    <>
      <h2 className="head-popup">ลงทะเบียนผู้ใช้ทั่วไป</h2>
      <DialogContent sx={{ px: 25, py: 3 }}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="outlined-name"
              label="ชื่อ"
            />
          </div>
        </Box>
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
export default CommonRegistPopup;
