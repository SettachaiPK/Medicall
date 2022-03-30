import { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DeliveryOrderDetails from "../../components/DeliveryOrderDetails";
import { actionGetOrders } from "../../actions/pharmacy.actions";

function DeliveryManagement(props) {
  const { actionGetOrders } = props;
  const [value, setValue] = useState("1");
  const [orders, setOrders] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchProducts() {
      const res = await actionGetOrders();
      console.log(res);
      setOrders(res);
    }
    fetchProducts();
  }, [actionGetOrders]);

  return (
    <div>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ border: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} centered variant="fullWidth">
              <Tab label="ต้องจัดส่ง" value="1" />
              <Tab label="จัดส่งแล้ว" value="2" />
              <Tab label="ถูกยกเลิก" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <DeliveryOrderDetails orders={orders} orderStats="paid" />
          </TabPanel>
          <TabPanel value="2">
            <DeliveryOrderDetails orders={orders} orderStats="shipped" />
          </TabPanel>
          <TabPanel value="3">
            <DeliveryOrderDetails orders={orders} orderStats="received" />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

DeliveryManagement.defaultProps = {};
DeliveryManagement.propTypes = {
  actionGetProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { actionGetOrders: actionGetOrders })(
  DeliveryManagement
);
