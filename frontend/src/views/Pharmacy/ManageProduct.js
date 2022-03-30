import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ManageProductComponent from "../../components/ManageProductComponent";
import { Avatar, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import CustomSpeedDial from "../../components/CustomSpeedDial";
import { actionGetProducts } from "../../actions/pharmacy.actions";

const pharmacy_name = "pharmacy name";

const classes = {
  icon: { color: "#AFE7E7" },
};

function ManageProduct(props) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    { productName: "Product_1", productPrice: "50", productMedia: null },
    { productName: "Product_2", productPrice: "100", productMedia: null },
    { productName: "Product_3", productPrice: "1000", productMedia: null },
    { productName: "Product_4", productPrice: "500", productMedia: null },
    { productName: "Product_5", productPrice: "500", productMedia: null },
    { productName: "Product_6", productPrice: "500", productMedia: null },
    { productName: "Product_7", productPrice: "500", productMedia: null },
    { productName: "Product_8", productPrice: "500", productMedia: null },
  ]);

  const speedDialActions = [
    {
      icon: <AllInboxIcon sx={classes.icon} />,
      name: "จัดการสินค้า",
      action: () => {
        navigate(`/product/manage-delivery`);
      },
    },
  ];

  useEffect(() => {
    async function fetchProducts() {
      const res = await props.actionGetProducts();
      setProducts(res);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <CustomSpeedDial actions={speedDialActions} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar
          src="/broken-image.jpg"
          sx={{ width: "4rem", height: "4rem" }}
        />
        <Button sx={{ fontSize: "x-small", fontWeight: 400 }}>
          เปลี่ยนรูปโปรไฟล์
        </Button>
        <Typography sx={{ fontSize: "1.4rem" }}>{pharmacy_name}</Typography>
      </Box>
      <Grid
        width={"80%"}
        margin="auto"
        container
        rowSpacing={3}
        columnSpacing={0}
      >
        <Box
          sx={{
            width: "10rem",
            height: "8rem",
            p: "1rem",
            margin: "auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="Add Product"
            component="span"
            sx={{ width: "100%" }}
          >
            <AddCircleIcon sx={{ fontSize: 100, color: grey[400] }} />
          </IconButton>
        </Box>
        {products.map((product, index) => {
          return (
            <Grid item xs={4} md={4} lg={3} xl={2} key={index}>
              <Box sx={{ justifyContent: "center", display: "flex" }}>
                <ManageProductComponent key={index} product={product} />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

ManageProduct.defaultProps = {};
ManageProduct.propTypes = {
  actionGetProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionGetProducts: actionGetProducts,
})(ManageProduct);
