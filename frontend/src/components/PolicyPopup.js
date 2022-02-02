import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { pink, grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function PolicyPopup(props) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleSubmit = () => {
    props.onSubmit();
  };
  return (
    <>
      <label
        style={{
          "padding-top": "15px",
          "padding-left": "25px",
          color: "#616161",
        }}
      >
        ข้อตกลงการให้บริการ
      </label>
      <DialogContent
        sx={{
          pb: 0,
        }}
      >
        <Box
          sx={{
            width: 300,
            height: 300,
            overflow: "auto",
            whiteSpace: "normal",
          }}
        >
          <fieldset>
            <div
              style={{ height: "280px", overflow: "auto", color: "#616161" }}
            >
              <label>
                This policy has been established to ensure consistency of all
                external advertisement of university positions. External
                advertisements are supplemental to internal postings and
                recruitment/hiring policy requirements. Recruitment resources
                such as businesses, organizations, professional associations,
                alumni groups, listservs and trade journals can be utilized by
                departments to aid in the search process. S/C/Ds needing
                assistance in identifying other potential recruitment resources
                may contact Human Resources Client Services.
              </label>
            </div>
          </fieldset>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          pb: 2,
          px: 3.5,
          maxWidth: "lg",
          fullWidth: true,
          display: "block",
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={handleChange} />}
          label="ยอมรับช้อตกลงการให้บริการ"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            sx={{
              background: pink[100],
              color: grey[50],
              fontWeight: 900,
              fontSize: 20,
            }}
            disabled={!checked}
            onClick={handleSubmit}
          >
            ยืนยัน
          </Button>
        </div>
      </DialogActions>
    </>
  );
}
export default PolicyPopup;
