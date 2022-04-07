
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CallComponent from "./CallComponent";
import CustomerCallDetails from "./CustomerCallDetails";
import { Box } from "@mui/system";
import { Button, Paper, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { actionChangeAdvice } from "../actions/consulting.action";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";

import {
  actionFetchProductAmount,
  actionGetProductsConsultant,
  actionRemoveProduct,
  actionSelectProduct,
} from "../actions/consultant.action";
const height = "10rem";

function CallConsultant(props) {
  const { products, search, selectedProducts } = props.recommendedProducts;
  const { actionGetProductsConsultant } = props;
  const onChangeInput = (e) => {
    console.log("onChangeInput");
    props.actionChangeAdvice(e);
  };

  const product = {
    product_name: "product_name",
    pharmacy: "pharmacy",
    price: "price",
  };
  useEffect(() => {
    actionGetProductsConsultant(search);
    console.log(search);
  }, [actionGetProductsConsultant, search]);
  useEffect(() => {
    console.log(selectedProducts);
  }, [selectedProducts]);
  return (
    <div
      style={{
        display: "flex",
        alignitems: "stretch",
        margin: "auto",
        "justify-content": "center",
      }}
    >
      <CustomerCallDetails />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: "63rem" }}>
          <CallComponent jobID={props.jobID} advice={props.consulting.advice} />
        </Box>
        <TextField
          inputProps={{
            style: {
              height,
              width: "50rem",
            },
          }}
          sx={{ mt: 3 }}
          multiline
          rows={4}
          id="outlined-basic"
          label="คำแนะนำจากคุณ"
          variant="outlined"
          value={props.consulting.advice}
          onChange={(e) => onChangeInput(e.target.value)}
        />
        <Box
          sx={{
            mt: "1.5rem",
            p: "2rem",
            border: 1,
            borderColor: grey[300],
            borderRadius: 1,
          }}
        >
          <Typography sx={{ mb: "0.5rem" }}>แนะนำสินค้า :</Typography>
          <Box sx={{ justifyContent: "center" }}>
            <FormControl sx={{ m: 1, width: "70%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-Search">
                Search
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-Search"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <SearchIcon sx={{ color: "#FFC1C1" }} />
                    </IconButton>
                  </InputAdornment>
                }
                label="Search"
              />
            </FormControl>
          </Box>

          {products.map((product, index) => {
            return (
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  p: "2rem",
                  m: "1rem",
                }}
                key={index}
              >
                <Typography>{product.productName}</Typography>
                <Typography>{product.storeName}</Typography>
                <Typography>
                  {parseFloat(product.productPrice).toFixed(4)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>จำนวน : </Typography>
                  <TextField
                    variant="outlined"
                    sx={{ width: "4rem", ml: 2 }}
                    type="number"
                    value={product.amount}
                    onChange={(e) =>
                      props.actionFetchProductAmount({
                        index,
                        amount: e.target.value,
                      })
                    }
                  ></TextField>
                </Box>
                <Button
                  sx={{ textDecoration: "underline" }}
                  onClick={() => {
                    props.actionSelectProduct(product);
                  }}
                >
                  แนะนำ
                </Button>
              </Paper>
            );
          })}
          <Paper sx={{ alignItems: "center", p: "2rem", m: "1rem" }}>
            <Typography>สินค้าที่เลือกแล้ว :</Typography>
            {selectedProducts.map((product, index) => {
              return (
                <Box key={"s" + String(index)}>
                  <Typography sx={{ ml: "3rem" }}>
                    {product.productName} amount: {product.amount}
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        props.actionRemoveProduct(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

CallConsultant.defaultProps = {};
CallConsultant.propTypes = {
  consulting: PropTypes.object.isRequired,
  recommendedProducts: PropTypes.object.isRequired,
  actionChangeAdvice: PropTypes.func.isRequired,
  actionGetProductsConsultant: PropTypes.func.isRequired,
  actionFetchProductAmount: PropTypes.func.isRequired,
  actionSelectProduct: PropTypes.func.isRequired,
  actionRemoveProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  consulting: state.consulting,
  recommendedProducts: state.recommendedProducts,
});

export default connect(mapStateToProps, {
  actionChangeAdvice: actionChangeAdvice,
  actionGetProductsConsultant: actionGetProductsConsultant,
  actionFetchProductAmount: actionFetchProductAmount,
  actionSelectProduct: actionSelectProduct,
  actionRemoveProduct: actionRemoveProduct,
})(CallConsultant);
