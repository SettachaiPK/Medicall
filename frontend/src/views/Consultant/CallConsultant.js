import React from "react";
import CallComponent from "../../components/CallComponent";
import CustomerCallDetails from "../../components/CustomerCallDetails";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";

const height = "10rem";

export default function CallConsultant() {
  return (
    <div style={{ display: "flex", alignitems: "stretch", margin: "auto" }}>
      <CustomerCallDetails />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: "63rem" }}>
          <CallComponent />
        </Box>
        <TextField
          inputProps={{
            style: {
              height,
              width: "50rem",
            },
          }}
          id="outlined-basic"
          label="คำแนะนำจากคุณ"
          variant="outlined"
        />
      </Box>
    </div>
  );
}
