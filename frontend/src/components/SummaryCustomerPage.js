import { Typography } from '@mui/material'
import React from 'react'
import { Box } from '@mui/system'
import { Avatar } from '@mui/material'
import { Button } from '@mui/material'

export default function SummaryCustomerPage() {
  return (
    <>
    <Box>
    <Typography>MEETING SUMMARY</Typography>
    <Avatar
          sx={{ width: 60, height: 60 }}
          src="/broken-image.jpg"
        />
    <Box>
    <Typography>firstName</Typography>
    <Typography>lastName</Typography>
    </Box>
    <Button variant="text">เพิ่มในรายการโปรด</Button>
    </Box>
    </>
  );
}
