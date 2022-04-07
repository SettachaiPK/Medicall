import React from "react";
import { Dialog, ListItemButton } from "@mui/material";
import CalendarPicker from '@mui/lab/CalendarPicker';
import { Grid } from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Box } from "@mui/system";
import { ListItem } from "@mui/material";
import { List } from "@mui/material";
import { ListItemText } from "@mui/material";


export default function BookingConsultPopUp(props) {
  const handleClose = () => {
    props.onClose();
  };
  const [date, setDate] = React.useState(new Date());
  const available = ["12.00-12.15","12.15-12.30","12.30-12.45","12.45-13.00"];
  const unavailable =["13.00-13.15","13.15-13.30","13.30-13.45","13.45-14.00"];
  return <Dialog open={props.open} onClose={handleClose}>
<Box>
<LocalizationProvider dateAdapter={AdapterDateFns}>
          <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)} />
    </LocalizationProvider>
    <Box>
    <List sx={{ width: '100%',display:"flex",flexDirection:"column", bgcolor: 'background.paper' }}>
    <ListItem>
      {available.map((value) => (
        <ListItemButton>
        <ListItemText primary={` ${value} น.`} />
      </ListItemButton>
      ))}
       {unavailable.map((value) => (
        <ListItemButton>
          <ListItemText primary={` ${value} น.`} />
        </ListItemButton>
      ))}
      </ListItem>
    </List> 
    </Box>
    </Box>
  </Dialog>;
}
