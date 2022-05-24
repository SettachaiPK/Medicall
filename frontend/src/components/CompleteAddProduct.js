import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

export default function CompleteAddProduct() {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate(`../product/manage`);
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          mt: "5rem",
        }}
      >
        <CheckCircleIcon sx={{ color: "#FFC1C1", fontSize: 200 }} />
        <Typography sx={{ color: "#FFC1C1", fontSize: 40 }}>
          เพิ่มสินค้าเสร็จสมบูรณ์
        </Typography>
        <Button
          sx={{ backgroundColor: "#FFC1C1", color: grey[500], mt: 3 }}
          onClick={handleSubmit}
        >
          ยืนยัน
        </Button>
      </Box>
    </div>
  );
}
