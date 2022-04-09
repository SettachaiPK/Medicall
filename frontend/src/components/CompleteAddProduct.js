import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

export default function CompleteAddProduct() {
  return (
    <div>
        <Box sx={{display: "flex",flexDirection: "column",alignItems: "center",width:"100%",mt:"5rem"}}>
            <CheckCircleIcon sx={{ color: "#FFC1C1",fontSize:200 }} />
            <Typography sx={{ color: "#FFC1C1",fontSize:40 }}>เพิ่มสินค้าเสร็จสมบูรณ์</Typography>
        </Box>
    </div>
  )
}
