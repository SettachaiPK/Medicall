import { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CallComponent from "./CallComponent";
import CustomerCallDetails from "./CustomerCallDetails";
import { Box } from "@mui/system";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { actionChangeAdvice } from "../actions/consulting.action";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
const height = "10rem";

function CallConsultant(props) {
  const onChangeInput = (e) => {
    console.log("onChangeInput");
    props.actionChangeAdvice(e);
  };

  const product = {
    product_name: "product_name",
    pharmacy: "pharmacy",
    price: "price",
  };
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
        <Box sx={{mt:"1.5rem",p:"2rem", border: 1, borderColor: grey[300],borderRadius: 1 }}>
          <Typography sx={{mb:"0.5rem"}}>แนะนำสินค้า :</Typography>
          <Box sx={{justifyContent:"center"}}>
          <FormControl sx={{ m: 1, width: "70%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-Search">Search</InputLabel>
            <OutlinedInput
              id="outlined-adornment-Search"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon sx={{color:"#FFC1C1"}}/>
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
            />
          </FormControl>
          </Box>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              p: "2rem",
              m: "1rem",
            }}
          >
            <Typography>{product.product_name}</Typography>
            <Typography>{product.pharmacy}</Typography>
            <Typography>{product.price}</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>จำนวน : </Typography>
              <TextField
                variant="outlined"
                sx={{ width: "4rem", ml: 2 }}
              ></TextField>
            </Box>
            <Button sx={{textDecoration:"underline"}}>แนะนำ</Button>
          </Paper>
          <Paper sx={{ alignItems: "center", p: "2rem", m: "1rem" }}>
            <Typography>สินค้าที่เลือกแล้ว :</Typography>
            <Box>
              <Typography sx={{ ml: "3rem" }}>
                {product.product_name}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

CallConsultant.defaultProps = {};
CallConsultant.propTypes = {
  consulting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  consulting: state.consulting,
});

export default connect(mapStateToProps, {
  actionChangeAdvice: actionChangeAdvice,
})(CallConsultant);
