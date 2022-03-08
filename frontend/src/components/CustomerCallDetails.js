import { TextField, Typography } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';
import { Avatar } from '@mui/material';
import { pink,grey } from '@mui/material/colors';
import {  useState, useRef } from "react";
import {  useDispatch } from "react-redux";

export default function CustomerCallDetails(user) {

const CustomerName = "customer name";
const dispatch = useDispatch();
const [profile, setProfile] = useState({ ...user });
const hiddenFileInput = useRef(null);

  return (
    <div style={{display:"flex"}}>
        <Box sx={{mt:"10%",mr:"10%",border: 1, borderColor: grey[300],width:"20rem",height:"100%", borderRadius: 1}}>
        <Box sx={{display:"flex",alignItems:"center",p:3,borderBottom: 1,borderColor: grey[300] }}>
            {<Avatar sx={{ bgcolor: pink[100] }}></Avatar>}
            <Typography sx={{p:2,fontSize:20}}>{CustomerName}</Typography>
        </Box>
        <Box sx={{p:5}}>
            <Typography sx={{pb:1,fontSize:16}}>อายุ:</Typography>
            <Typography sx={{pb:1,fontSize:16}}>เพศกำเนิด: {profile.sex}</Typography>
            <Typography sx={{pb:1,fontSize:16}}>โรคประจำตัว: {profile.congenitalDisease} </Typography>
            <Typography sx={{pb:1,fontSize:16}}>ยาที่รับประทานอยู่ : {profile.drugInUse}</Typography>
            <Typography sx={{pb:1,fontSize:16}}>ประวัติแพ้ยา: {profile.drugAllergy}</Typography>
        </Box>
        </Box>
    </div>
  )
}
