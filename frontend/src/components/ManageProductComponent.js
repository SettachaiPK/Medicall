import { Button, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { grey,pink } from '@mui/material/colors'
import React from 'react'


export default function ManageProductComponent(props) {
  return (
    <div>
        <Paper sx={{p:"1rem", width:"fit-content"}}>
            <Box sx={{ border: 1,borderColor: grey[300],width:"10rem",height:"8rem" }}>
            <img alt='PRODUCT'/>
            </Box>
            <Box sx={{display: "flex",flexDirection: "column",alignItems: "stretch",flexWrap: "wrap"}}>
            <Box>
            <Typography>{props.product.name}</Typography>
            <Typography sx={{fontWeight:300, color: pink[200]}}>{props.product.price} บาท</Typography>
            </Box>
            <Box sx={{display: "flex",justifyContent: "flex-end"}}>
            <Button sx={{ backgroundColor: "#FFC1C1", color: grey[500], height: "1.5rem", fontSize: "small"}}>แก้ไข</Button>
            </Box>
            </Box>
        </Paper>
    </div>
  )
}
