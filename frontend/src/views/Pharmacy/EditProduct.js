import React, { useRef } from "react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { grey } from "@mui/material/colors";
import { Tooltip } from "@mui/material";
import {
  actionEditProduct,
  actionGetProducts,
  actionGetProductSingle,
} from "../../actions/pharmacy.actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { actionDeleteProduct } from "../../actions/pharmacy.actions";

const height = "10rem";

function EditProduct(props) {
  const navigate = useNavigate();
  const params = useParams();
  const hiddenFileInput = useRef(null);
  const [files, setFiles] = useState(null);
  const [products, setProducts] = useState({
    productID: "",
    productName: "",
    productPrice: 0,
    productDetail: "",
  });
  const handleChangeEditProduct = (e, field) => {
    setProducts({ ...products, [field]: e.target.value });
  };
  const handleChangeFiles = (event) => {
    setFiles(event.target.files[0]);
  };
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("media", files);
    for (const [key, value] of Object.entries(products)) {
      formData.append(key, value);
    }
    props.actionEditProduct(formData);
    navigate(`../product/manage`);
  };
  const handleDelete = () => {
    props.actionDeleteProduct(products.productID);
    async function fetchProducts() {
      const res = await actionGetProducts();
      setProducts(res);
    }
    fetchProducts();
    navigate(`../product/manage`);
  };

  useEffect(() => {
    async function fetchProduct() {
      const res = await props.actionGetProductSingle(params.productID);
      if (res) {
        setProducts(res);
      } else {
        setProducts({ ...products, productID: params.productID });
      }
    }
    fetchProduct();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "fit-content",
        margin: "auto",
      }}
    >
      <TextField
        required
        label="ชื่อสินค้า"
        id="outlined-required"
        margin="normal"
        sx={{ width: "25rem" }}
        value={products.productName}
        onChange={(e) => handleChangeEditProduct(e, "productName")}
      />
      <TextField
        required
        label="ราคา"
        id="outlined-required"
        margin="normal"
        sx={{ width: "25rem" }}
        value={products.productPrice}
        onChange={(e) => handleChangeEditProduct(e, "productPrice")}
      />
      <TextField
        inputProps={{
          style: {
            height,
          },
        }}
        label="รายละเอียด"
        multiline
        rows={4}
        id="outlined"
        margin="normal"
        sx={{ width: "25rem" }}
        value={products.productDetail}
        onChange={(e) => handleChangeEditProduct(e, "productDetail")}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "27rem",
        }}
      >
        <input
          type="file"
          name="media"
          accept="image/png, image/jpeg"
          ref={hiddenFileInput}
          onChange={handleChangeFiles}
          hidden
        />
        <Tooltip title="เพิ่มรูปภาพสินค้า" placement="top-start" arrow>
          <IconButton
            aria-label="Add Product"
            onClick={() => {
              hiddenFileInput.current.click();
            }}
          >
            <AddBoxIcon sx={{ fontSize: 100, color: grey[400] }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          p: "1.5rem",
        }}
      >
        <Button
          sx={{ backgroundColor: "#B5EEF9", color: grey[500] }}
          onClick={handleDelete}
        >
          ลบสินค้า
        </Button>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            sx={{
              color: grey[400],
              textDecoration: "underline",
              fontWeight: 400,
              mr: 1,
            }}
            onClick={() => {
              navigate(`../product/manage`);
            }}
          >
            ยกเลิก
          </Button>
          <Button
            sx={{ backgroundColor: "#FFC1C1", color: grey[500] }}
            onClick={handleSubmit}
          >
            ยืนยัน
          </Button>
        </Box>
      </Box>
    </div>
  );
}
EditProduct.defaultProps = {};
EditProduct.propTypes = {
  actionEditProduct: PropTypes.func.isRequired,
  actionDeleteProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionEditProduct: actionEditProduct,
  actionDeleteProduct: actionDeleteProduct,
  actionGetProductSingle: actionGetProductSingle,
  actionGetProducts: actionGetProducts,
})(EditProduct);
