import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeliveryOrderDetails from '../../components/DeliveryOrderDetails';

export default function DeliveryManagement() {
    const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ border: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}  centered variant="fullWidth">
            <Tab label="ต้องจัดส่ง" value="1" />
            <Tab label="จัดส่งแล้ว" value="2" />
            <Tab label="ถูกยกเลิก" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"><DeliveryOrderDetails/></TabPanel>
        <TabPanel value="2"><DeliveryOrderDetails/></TabPanel>
        <TabPanel value="3"><DeliveryOrderDetails/></TabPanel>
      </TabContext>
    </Box>
    </div>
  )
}
