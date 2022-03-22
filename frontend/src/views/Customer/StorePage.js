import { Box } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CustomSpeedDial from "../../components/CustomSpeedDial";

const classes = {
  icon: { color: "#AFE7E7" },
};

function StorePage(props) {
  const navigate = useNavigate();

  const speedDialActions = [
    {
      icon: <ShoppingBagIcon sx={classes.icon} />,
      name: "ตะกร้าสินค้า",
      action: () => {
        navigate(`/`);
      },
    },
    {
      icon: <AccessTimeIcon sx={classes.icon} />,
      name: "สถานะสินค้า",
      action: () => {
        navigate(`/menu`);
      },
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CustomSpeedDial actions={speedDialActions} />
    </Box>
  );
}

StorePage.defaultProps = {};
StorePage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(StorePage);
