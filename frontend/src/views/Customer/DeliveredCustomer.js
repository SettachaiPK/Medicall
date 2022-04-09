import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeliveryOrderDetails from "../../components/DeliveryOrderDetails";


export default function DeliveredCustomer() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} centered variant="fullWidth">
            <Tab label="ต้องจัดส่ง" value="1" />
            <Tab label="จัดส่งแล้ว" value="2" />
            <Tab label="ได้รับแล้ว" value="3" />
            <Tab label="ยกเลิกแล้ว" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1"><DeliveryOrderDetails /></TabPanel>
          <TabPanel value="2"><DeliveryOrderDetails /></TabPanel>
          <TabPanel value="3"><DeliveryOrderDetails /></TabPanel>
          <TabPanel value="4"><DeliveryOrderDetails /></TabPanel>
        </TabContext>
      </Box>
    );
}
