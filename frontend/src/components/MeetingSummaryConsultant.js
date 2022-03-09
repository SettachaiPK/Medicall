import React from 'react';
import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { pink, grey } from "@mui/material/colors";

const date = "00/00/00";
const time = "00.00";
const total_time = "00 min";
const Type = "type";
const cash = "1000";
const discount = "20";
const TotalChange ="1000";

export default function MeetingSummaryConsultant() {
  return (
    <div>
    <Paper
    sx={{
      width: "40rem",
      height: "40rem",
      margin: "auto",
      padding: "3%",
      marginTop: "2%",
    }}
  >
    <Box sx={{ margin: "auto", width: "fit-content" }}>
      <label style={{ color: pink[100], fontSize: "2rem" }}>
        ผลการปรึกษา
      </label>
    </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Avatar
        sx={{ bgcolor: grey[300], height: "4rem", width: "4rem" }}
      ></Avatar>
      <label style={{padding:"0.5rem",fontSize:"18px"}}>Customer Name</label>
    </Box>
    <Box sx={{display:"flex",alignItems: "center",justifyContent: "center"}}>
        <label style={{color: pink[100],fontSize:"2rem",paddingBottom:"1rem",paddingLeft:"1rem"}}>ยอดรายรับ : </label> 
        <label style={{color: pink[100],fontSize:"2rem",paddingBottom:"1rem",paddingLeft:"1rem"}}>{TotalChange} บาท</label>
    </Box>
    <Box
      sx={{
        m: "0.5rem",
        p: "1rem",
        border: 1,
        borderRadius: 1,
        borderColor: grey[400],
      }}
    >
      <label>รายละเอียดการสนทนา :</label>
      <Box
        sx={{
          bgcolor: grey[300],
          height: "10rem",
          marginTop: "1rem",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      >
        <label>คำแนะนำจากผู้ให้คำปรึกษา :</label>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: "0.5rem",
        }}
      >
        <Box sx={{ display: "grid" }}>
          <label>วันที่: {date}</label>
          <label>เวลา: {time}</label>
          <label>เวลาทั้งหมด: {total_time}</label>
        </Box>
        <Box sx={{ display: "grid" }}>
          <label>ชนิดของการสนทนา: {Type}</label>
          <label>จำนวนเงิน: {cash} บาท</label>
          <label>ส่วนลดทั้งหมด: {discount} บาท</label>
        </Box>
      </Box>
    </Box>
  </Paper>
  </div>
  )
}
