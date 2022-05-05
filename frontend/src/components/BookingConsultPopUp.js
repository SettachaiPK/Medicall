import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { createSlots } from "../helpers/timeSlot";
import { Box } from "@mui/system";
import {
  Dialog,
  ListItemButton,
  DialogContent,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItem,
  Grid,
  Button,
  Checkbox,
  Slider,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import CalendarPicker from "@mui/lab/CalendarPicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import MessageIcon from "@mui/icons-material/Message";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import { bookConsultJob } from "../service/customer.service";

const height = 100;
const Discount = 0;
const label = { inputProps: { "aria-label": "Checkbox demo" } };
function valuetext(value) {
  return `${value}min`;
}

function BookingConsultPopUp(props) {
  const { customerBooking } = props;
  const fileInput = useRef();
  const [date, setDate] = useState(new Date());
  const [available, setAvailable] = useState([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    communicationChannel: "",
    reservePeriod_m: 15,
    expectedPrice: 0,
    symptomDetail: "",
    media: null,
    scheduleDate: "",
  });
  const [Change, setChange] = useState("");
  const [Coupon, setCoupon] = useState("");
  useEffect(() => {
    setAvailable(createSlots(customerBooking.consultantSchedule, date));
  }, [date, customerBooking]);
  useEffect(() => {
    setForm((prevState) => {
      return {
        ...prevState,
        expectedPrice:
          form.communicationChannel === "message"
            ? (form.reservePeriod_m / 15) * props.price.messagePrice
            : form.communicationChannel === "voice"
            ? (form.reservePeriod_m / 15) * props.price.voiceCallPrice
            : form.communicationChannel === "video"
            ? (form.reservePeriod_m / 15) * props.price.videoCallPrice
            : 0,
      };
    });
  }, [form.reservePeriod_m, form.communicationChannel]);
  const handleClose = () => {
    setStep(0);
    props.onClose();
  };
  const handleChange = (event) => {
    setChange(event.target.value);
  };
  const handleCoupon = (event) => {
    setCoupon(event.target.value);
  };
  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const handleChangeFiles = (event) => {
    const { name, files } = event.target;
    setForm((prevState) => {
      return {
        ...prevState,
        [name]: files,
      };
    });
  };
  const submit = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      formData.append("consultantID", props.consultantID);
      const {
        data: {
          paymentDetail: { paymentID },
        },
      } = await bookConsultJob(formData);
      handleClose();
      //await confirmPayment({ paymentID });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSelectTime = (startDate) => {
    setForm((prevState) => {
      return {
        ...prevState,
        scheduleDate: startDate,
      };
    });
    setStep(1);
  };
  return (
    <Dialog open={props.open} onClose={handleClose}>
      {step === 0 && (
        <Box sx={{ display: "flex" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CalendarPicker
              date={date}
              onChange={(newDate) => {
                setDate(newDate);
              }}
            />
          </LocalizationProvider>
          <Box>
            <List
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                height: 360,
                overflowY: "scroll",
              }}
            >
              {available.map((value) => (
                <ListItem>
                  <ListItemButton
                    disabled={value.status !== "bookable"}
                    onClick={() => {
                      handleSelectTime(value.dateSlotStart);
                    }}
                  >
                    <Box>
                      <ListItemText
                        primary={`${value.timeSlotStart} - ${value.timeSlotEnd} น.`}
                      />
                      <ListItemText
                        primary={`${
                          value.status === "bookable"
                            ? "จองได้"
                            : value.status === "booked"
                            ? "ถูกจองแล้ว"
                            : "ไม่ว่าง"
                        }`}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}
      {step === 1 && (
        <DialogContent>
          <Box sx={{ display: "grid", justifyItems: "start" }}>
            <TextField
              inputProps={{
                style: {
                  height,
                  width: 350,
                  padding: "0 14px",
                },
              }}
              label="อาการเบื้องต้น"
              name="symptomDetail"
              value={form.symptomDetail}
              onChange={handleChangeForm}
            />
            <Button
              sx={{ marginTop: "3%", color: grey[600], borderColor: grey[400] }}
              variant="outlined"
              startIcon={<AddAPhotoIcon />}
              onClick={() => {
                fileInput.current.click();
              }}
            >
              เพิ่มรูปภาพ
              <input
                type="file"
                name="media"
                accept="image/png, image/jpeg"
                onChange={handleChangeFiles}
                multiple
                ref={fileInput}
                hidden
              />
            </Button>
          </Box>

          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: grey[400],
              borderRadius: 2,
              marginTop: "5%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Box sx={{ display: "grid", justifyItems: "center" }}>
                <Checkbox
                  {...label}
                  icon={<MessageIcon sx={{ color: grey[400], fontSize: 35 }} />}
                  checkedIcon={
                    <MessageIcon sx={{ color: pink[100], fontSize: 35 }} />
                  }
                  disabled
                  name="communicationChannel"
                  checked={form.communicationChannel === "message"}
                  value={"message"}
                  onChange={handleChangeForm}
                />
                <label>{props.price.messagePrice}</label>
              </Box>
              <Box sx={{ display: "grid", justifyItems: "center" }}>
                <Checkbox
                  {...label}
                  icon={<CallIcon sx={{ color: grey[400], fontSize: 35 }} />}
                  checkedIcon={
                    <CallIcon sx={{ color: pink[100], fontSize: 35 }} />
                  }
                  name="communicationChannel"
                  checked={form.communicationChannel === "voice"}
                  value={"voice"}
                  onChange={handleChangeForm}
                />
                <label>{props.price.voiceCallPrice}</label>
              </Box>
              <Box sx={{ display: "grid", justifyItems: "center" }}>
                <Checkbox
                  {...label}
                  icon={
                    <VideocamIcon sx={{ color: grey[400], fontSize: 40 }} />
                  }
                  checkedIcon={
                    <VideocamIcon sx={{ color: pink[100], fontSize: 40 }} />
                  }
                  name="communicationChannel"
                  checked={form.communicationChannel === "video"}
                  value={"video"}
                  onChange={handleChangeForm}
                />
                <label>{props.price.videoCallPrice}</label>
              </Box>
            </Box>
            <Box sx={{ marginTop: "3%", padding: "3%" }}>
              <label>ระยะเวลาที่ต้องการปรึกษา : </label>
              <Slider
                sx={{ color: pink[100] }}
                aria-label="Time Range"
                name="reservePeriod_m"
                value={form.reservePeriod_m}
                onChange={handleChangeForm}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={15}
                marks
                min={15}
                max={60}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label className="mb-1">
                เวลาเริ่ม{" "}
                {moment(form.scheduleDate).format("DD/MM/YYYY - HH:mm")} น.
              </label>{" "}
              <label>
                เวลาสิ้นสุด{" "}
                {moment(form.scheduleDate)
                  .add(form.reservePeriod_m, "m")
                  .format("DD/MM/YYYY - HH:mm")}{" "}
                น.
              </label>
            </Box>
          </Box>
          <Box
            sx={{
              p: 1,
              border: 1,
              borderColor: grey[400],
              borderRadius: 2,
              marginTop: "5%",
            }}
          >
            <Box sx={{ minWidth: 120, marginTop: "5%" }}>
              <FormControl fullWidth disabled>
                <InputLabel id="demo-simple-select-label">
                  ช่องทางการชำระเงิน
                </InputLabel>
                <Select
                  sx={{ height: 50 }}
                  labelId="demo-simple-select-label"
                  value={Change}
                  label="Change"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120, marginTop: "5%" }}>
              <FormControl fullWidth disabled>
                <InputLabel id="demo-simple-select-label">คูปอง</InputLabel>
                <Select
                  sx={{ height: 50 }}
                  labelId="demo-simple-select-label"
                  value={Coupon}
                  label="Coupon"
                  onChange={handleCoupon}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: "3%",
              }}
            >
              <Typography sx={{ color: grey[500] }}>ส่วนลด :</Typography>
              <Typography sx={{ color: pink[500] }}>-{Discount} บาท</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: "3%",
              }}
            >
              <Typography sx={{ color: grey[500] }}>
                จำนวนเงินที่ต้องชำระ :
              </Typography>
              <Typography>{form.expectedPrice} บาท</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5%",
              marginBottom: "3%",
            }}
          >
            <Button
              sx={{
                color: grey[400],
              }}
              size="Large"
            >
              ยกเลิก
            </Button>
            <Button
              sx={{ background: pink[100], color: grey[50] }}
              variant="contained"
              size="Large"
              onClick={submit}
              disabled={!form.communicationChannel}
            >
              ยืนยัน
            </Button>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}

BookingConsultPopUp.propTypes = {};
BookingConsultPopUp.defaultProps = {
  price: {
    messagePrice: 0,
    voiceCallPrice: 0,
    videoCallPrice: 0,
  },
  consultantID: "",
};
const mapStateToProps = (state) => ({ customerBooking: state.customerBooking });

export default connect(mapStateToProps, {})(BookingConsultPopUp);
