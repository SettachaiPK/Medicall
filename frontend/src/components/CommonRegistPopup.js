import * as React from "react";
import moment from "moment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { pink, grey } from "@mui/material/colors";
import PhoneInput from "react-phone-input-2";
import { fontWeight } from "@mui/system";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function CommonRegistPopup(props) {
  const [formValue, setFormValue] = React.useState({
    firstName: "",
    lastName: "",
    birthDate: new Date(),
    sex: "",
    weight: 0,
    height: 0,
    congenitalDisease: "",
    drugAllergy: "",
    drugInUse: "",
  });
  const {
    firstName,
    lastName,
    birthDate,
    sex,
    weight,
    height,
    congenitalDisease,
    drugAllergy,
    drugInUse,
  } = formValue;

  const handleSubmit = () => {
    props.onSubmit(formValue);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  return (
    <>
      <div
        style={{
          width: "25rem",
        }}
      >
        <h2
          className="head-popup"
          style={{
            paddingLeft: "6rem",
          }}
        >
          ลงทะเบียนผู้ใช้ทั่วไป
        </h2>
        <DialogContent sx={{ px: 8, py: 3 }}>
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
                name="firstName"
                value={firstName}
                onChange={handleChange}
                className='w-100'
              />
              <TextField
                required
                id="outlined-name"
                label="นามสกุล"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                className='w-100'
              />
              <LocalizationProvider dateAdapter={DateAdapter}
              >
                <DesktopDatePicker label="วันเกิด"
                  value={birthDate}
                  onChange={(newValue) => {
                    setFormValue({ ...formValue, ["birthDate"]: newValue });
                  }}
                  renderInput={(params) => <TextField
                    className='w-100' {...params} />}
                />
              </LocalizationProvider>
              <FormControl sx={{ pl: 1 }}>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  เพศกำเนิด
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="sex"
                  value={sex}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="หญิง"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="ชาย"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                id="outlined-number"
                label="น้ำหนัก"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                name="weight"
                value={weight}
                onChange={handleChange}
                className='w-100'
              />
              <TextField
                id="outlined-number"
                label="ส่วนสูง"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                name="height"
                value={height}
                onChange={handleChange}
                className='w-100'
              />
              <TextField
                id="outlined-multiline-static"
                label="โรคประจำตัว"
                multiline
                rows={4}
                name="congenitalDisease"
                value={congenitalDisease}
                onChange={handleChange}
                className='w-100'
              />
              <TextField
                id="outlined-multiline-static"
                label="ประวัติการแพ้ยา"
                multiline
                rows={4}
                name="drugAllergy"
                value={drugAllergy}
                onChange={handleChange}
                className='w-100'
              />
              <TextField
                id="outlined-multiline-static"
                label="ยาที่กำลังทานอยู่"
                multiline
                rows={4}
                name="drugInUse"
                value={drugInUse}
                onChange={handleChange}
                className='w-100'
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ m: "auto", pb: 3, maxWidth: "lg", fullWidth: true }}
        >
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "4rem",
          }}>
            <Button
              sx={{
                m: "auto",
                background: pink[100],
                color: grey[50],
                fontWeight: 900,
                fontSize: 20,
              }}
              onClick={handleSubmit}
            >
              ยืนยัน
            </Button>
          </div>
        </DialogActions>
      </div>
    </>
  );
}
export default CommonRegistPopup;
