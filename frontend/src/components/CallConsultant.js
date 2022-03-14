import { useState } from "react";
import CallComponent from "./CallComponent";
import CustomerCallDetails from "./CustomerCallDetails";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";

const height = "10rem";

export default function CallConsultant(props) {
  const [values, setValues] = useState({
    advice: "",
  });

  const onChangeInput = (key, val) => {
    setValues({ ...values, [key]: val });
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
          <CallComponent jobID={props.jobID} advice={values.advice} />
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
          value={values.advice}
          onChange={(e) => onChangeInput("advice", e.target.value)}
        />
      </Box>
    </div>
  );
}
