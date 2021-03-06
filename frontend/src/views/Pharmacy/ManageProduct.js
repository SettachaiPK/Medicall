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
import { actionGetStoreDetail } from "../../actions/pharmacy.actions";

const classes = {
  icon: { color: "#AFE7E7" },
};

function ManageProduct(props) {
  const navigate = useNavigate();
  const { actionGetProducts } = props;
  const actionGetStoreDetail = props.actionGetStoreDetail;

  const [products, setProducts] = useState([]);

  const [details, setDetails] = useState([
    { storeName: "Name", location: "location", avatar: null, status: "active" },
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
      const res = await actionGetProducts();
      setProducts(res);
    }
    async function fetchDetail() {
      const res = await actionGetStoreDetail();
      setDetails(res);
    }
    fetchDetail();
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
          //src={`data:image/png;base64, ${details.avatar}`}
          src="https://scontent.fbkk5-7.fna.fbcdn.net/v/t1.6435-9/117554409_1585030948326266_4183901343872513839_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGYX8oeFCON5EeosTaEXqNMGmNzk9kctFkaY3OT2Ry0WS0YTWdJLgV48k28mLXx0a31tP4FW_ILqH1LxutvZOvZ&_nc_ohc=aYT6I9PSy1gAX_TZd3Z&_nc_ht=scontent.fbkk5-7.fna&oh=00_AT_m0tmZ0d4wnCMN-5cmdzjBtAmtPqHSVn_NdDog2xe_Rw&oe=62B10AE5"
          sx={{ width: "4rem", height: "4rem" }}
        />
        <Button sx={{ fontSize: "x-small", fontWeight: 400 }} disabled>
          เปลี่ยนรูปโปรไฟล์
        </Button>
        <Typography sx={{ fontSize: "1.4rem" }}>{details.storeName}</Typography>
      </Box>
      {products.length > 0 && (
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
            <Button href="addproduct">
              <IconButton
                aria-label="Add Product"
                component="span"
                sx={{ width: "100%" }}
              >
                <AddCircleIcon sx={{ fontSize: 100, color: grey[400] }} />
              </IconButton>
            </Button>
          </Box>
          {products.map((product, index) => {
            return (
              <Grid item xs={6} md={4} lg={3} xl={2} key={index}>
                <Box sx={{ justifyContent: "center", display: "flex" }}>
                  <ManageProductComponent key={index} product={product} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
}

ManageProduct.defaultProps = {};
ManageProduct.propTypes = {
  actionGetProducts: PropTypes.func.isRequired,
  actionGetStoreDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionGetProducts: actionGetProducts,
  actionGetStoreDetail: actionGetStoreDetail,
})(ManageProduct);
