import React from "react";
import CallComponent from "./CallComponent";
import CustomerCallDetails from "./CustomerCallDetails";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";

const height = "10rem";

export default function CallConsultant() {
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
          <CallComponent />
        </Box>
        <TextField
          inputProps={{
            style: {
              height,
              width: "50rem",
            },
          }}
          sx={{ mt: 3 }}
          id="outlined-basic"
          label="คำแนะนำจากคุณ"
          variant="outlined"
        />
      </Box>
    </div>
  );
}
