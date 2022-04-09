import React from "react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { grey } from "@mui/material/colors";
import { Tooltip } from "@mui/material";
import { actionAddProduct } from "../../actions/pharmacy.actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";

const height = "10rem";
function AddProduct(props) {
  const [products, setProducts] = useState({
    productName: "",
    productPrice: 0,
    productDetail: "",
  });
  const handleChangeAddProduct = (e, field) => {
    setProducts({ ...products, [field]: e.target.value });
  };
  const handleSubmit = () => {
    props.actionAddProduct(products);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TextField
        required
        label="ชื่อสินค้า"
        id="outlined-required"
        margin="normal"
        sx={{ width: "25rem" }}
        value={products.productName}
        onChange={(e) => handleChangeAddProduct(e, "productName")}
      />
      <TextField
        required
        type="number"
        label="ราคา"
        id="outlined-required"
        margin="normal"
        sx={{ width: "25rem" }}
        value={products.productPrice}
        onChange={(e) => handleChangeAddProduct(e, "productPrice")}
      />
      <TextField
        inputProps={{
          style: {
            height,
          },
        }}
        multiline
        rows={4}
        label="รายละเอียด"
        id="outlined"
        margin="normal"
        sx={{ width: "25rem" }}
        value={products.productDetail}
        onChange={(e) => handleChangeAddProduct(e, "productDetail")}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "27rem",
        }}
      >
        <Tooltip title="เพิ่มรูปภาพสินค้า" placement="top-start" arrow>
          <IconButton aria-label="Add Product">
            <AddBoxIcon sx={{ fontSize: 100, color: grey[400] }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ width: "55%", display: "flex", justifyContent: "flex-end" }}>
        <Button
          sx={{
            color: grey[400],
            textDecoration: "underline",
            fontWeight: 400,
            mr: 1,
          }}
          href="manage"
        >
          ยกเลิก
        </Button>
        <Button
          sx={{ backgroundColor: "#FFC1C1", color: grey[500] }}
          onClick={handleSubmit}
          href="complete-addproduct"
        >
          ยืนยัน
        </Button>
      </Box>
    </div>
  );
}
AddProduct.defaultProps = {};
AddProduct.propTypes = {
  actionAddProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionAddProduct: actionAddProduct,
})(AddProduct);
