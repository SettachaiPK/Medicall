import { Typography } from "@mui/material";
import React from "react";
import CallComponent from "../../components/CallComponent";
import { Box } from "@mui/system";
import { pink } from "@mui/material/colors";

const StartTime = "00.00";
const EndTime = "00.00";
const TotalTime = "15 min";

export default function Call() {
  return (
    <div>
     <CallComponent />
     <Box sx={{display:"flex",justifyContent:"space-around",pt:"2%",pb:"2%"}}>
       <Typography sx={{color: pink[200], fontSize:20}}>เวลาเริ่มต้น: {StartTime}</Typography>
       <Typography sx={{color: pink[200], fontSize:20}}>เวลาสิ้นสุด: {EndTime}</Typography>
       <Typography sx={{color: pink[200], fontSize:20}}>เวลาทั้งหมด: {TotalTime}</Typography>
     </Box>
    </div>
  );
}
