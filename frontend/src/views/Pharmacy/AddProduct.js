import React from "react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { grey } from "@mui/material/colors";
import { Tooltip } from "@mui/material";

const height = "10rem";
export default function AddProduct() {
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
      />
      <TextField
        required
        label="ราคา"
        id="outlined-required"
        margin="normal"
        sx={{ width: "25rem" }}
      />
      <TextField
        inputProps={{
          style: {
            height,
          },
        }}
        label="รายละเอียด"
        id="outlined"
        margin="normal"
        sx={{ width: "25rem" }}
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
      <Box sx={{width: "55%",display: "flex",justifyContent: "flex-end"}}>
          <Button sx={{color:grey[400], textDecoration:"underline", fontWeight:400,mr:1}}>ยกเลิก</Button>
          <Button sx={{backgroundColor: "#FFC1C1", color: grey[500]}}>ยืนยัน</Button>
      </Box>
    </div>
  );
}
