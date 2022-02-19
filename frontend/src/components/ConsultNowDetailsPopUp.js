import { Dialog,  DialogContent, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Button } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import { Checkbox } from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import { Slider } from "@mui/material";
import { FormControl } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { InputLabel } from "@mui/material";


function valuetext(value) {
  return `${value}min`;
}

export default function ConsultNowDetailsPopUp(props) {
  const handleClose = () => {
    props.onClose();
  };
  const [Change, setChange] = React.useState("");
  const [Coupon, setCoupon] = React.useState("");
  const handleChange = (event) => {
    setChange(event.target.value);
  };

  const handleCoupon = (event) => {
    setCoupon(event.target.value);
  };
  const height = 100;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const MessagePrice = "200/15";
  const VoicePrice = "200/15";
  const VideoPrice = "200/15";

  const Discount = "20";
  const Price="100";
  

  return (
    <>
      <Dialog open={props.open} onClose={handleClose}>
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
            />
            <Button
              sx={{ marginTop: "3%",color:grey[600],borderColor:grey[400] }}
              variant="outlined"
              startIcon={<AddAPhotoIcon />}
            >
              เพิ่มรูปภาพ
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
                />
                <label>{MessagePrice}</label>
              </Box>
              <Box sx={{ display: "grid", justifyItems: "center" }}>
                <Checkbox
                  {...label}
                  icon={<CallIcon sx={{ color: grey[400], fontSize: 35 }} />}
                  checkedIcon={
                    <CallIcon sx={{ color: pink[100], fontSize: 35 }} />
                  }
                />
                <label>{VoicePrice}</label>
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
                />
                <label>{VideoPrice}</label>
              </Box>
            </Box>
            <Box sx={{ marginTop: "3%", padding: "3%" }}>
              <label>ระยะเวลาที่ต้องการปรึกษา : </label>
              <Slider
                sx={{ color: pink[100] }}
                aria-label="Time Range"
                defaultValue={30}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={15}
                marks
                min={15}
                max={60}
              />
            </Box>
          </Box>
          <Box sx={{
              p: 1,
              border: 1,
              borderColor: grey[400],
              borderRadius: 2,
              marginTop: "5%",
            }}>
          <Box sx={{ minWidth: 120, marginTop: "5%"}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                ช่องทางการชำระเงิน
              </InputLabel>
              <Select
                sx={{height:50}}
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
          <Box sx={{ minWidth: 120, marginTop: "5%"}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">คูปอง</InputLabel>
              <Select
              sx={{height:50}}
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
          <Box sx={{display:"flex",justifyContent:"space-between",margin: "3%"}}>
          <Typography sx={{color:grey[500]}}>ส่วนลด :</Typography>
          <Typography sx={{color:pink[500]}} >-{Discount} บาท</Typography>
          </Box>
          <Box sx={{display:"flex",justifyContent:"space-between",margin: "3%"}}>
          <Typography sx={{color:grey[500]}}>จำนวนเงินที่ต้องชำระ :</Typography>
          <Typography >{Price} บาท</Typography>
          </Box>
          </Box>
          <Box sx={{display:"flex",justifyContent:"space-between",marginTop: "5%",marginBottom: "3%"}}>
            <Button sx={{
            color: grey[400]}}size="Large">ยกเลิก</Button>
            <Button sx={{background: pink[100],
            color: grey[50]}} variant="contained" size="Large">ยืนยัน</Button>
          </Box>
        </DialogContent>
        
      </Dialog> 
    </>
  );
}
