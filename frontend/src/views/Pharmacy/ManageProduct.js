import React from "react";
import ManageProductComponent from "../../components/ManageProductComponent";
import { Avatar, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import { grey } from "@mui/material/colors";

const pharmacy_name = "pharmacy name";
const product = [
  { name: "Product_1", price: "50" },
  { name: "Product_2", price: "100" },
  { name: "Product_3", price: "1000" },
  { name: "Product_4", price: "500" },
  { name: "Product_5", price: "500" },
  { name: "Product_6", price: "500" },
  { name: "Product_7", price: "500" },
  { name: "Product_8", price: "500" },
  
];

export default function ManageProduct() {
  return (
    <div>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", p:3 }}
      >
        <Avatar
          src="/broken-image.jpg"
          sx={{ width: "4rem", height: "4rem" }}
        />
        <Button sx={{ fontSize: "x-small", fontWeight: 400 }}>
          เปลี่ยนรูปโปรไฟล์
        </Button>
        <Typography sx={{fontSize:"1.4rem"}}>{pharmacy_name}</Typography>
      </Box>
      <Grid
        width={"80%"}
        margin="auto"
        container
        rowSpacing={3}
        columnSpacing={0}
      >
        <Box sx={{width:"10rem",height:"8rem",p: "1rem",margin: "auto", display: "flex",alignItems: "center"
 }}>
        <IconButton aria-label="Add Product" component="span" sx={{width:"100%"}}>
          <AddCircleIcon sx={{fontSize:100, color: grey[400]}}/>
        </IconButton>
        </Box>
        {product.map((product_name, index) => {
          return (
            <Grid item xs={4} md={4} lg={3} xl={2} key={index}>
                <Box sx={{justifyContent:'center', display:'flex'}}>
              <ManageProductComponent key={index} product={product_name} /></Box>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
