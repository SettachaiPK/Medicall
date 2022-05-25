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
          paddingTop: "15px",
          paddingLeft: "25px",
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
            height: "fit-content",
            overflow: "auto",
            whiteSpace: "normal",
          }}
        >
          <fieldset>
            <div
              style={{ height: 300, overflow: "auto", color: "#616161" }}
            >
              <label>
              Policy is a deliberate system of guidelines to guide decisions and achieve rational outcomes. A policy is a statement of intent and is implemented as a procedure or protocol. Policies are generally adopted by a governance body within an organization. Policies can assist in both subjective and objective decision making. Policies used in subjective decision-making usually assist senior management with decisions that must be based on the relative merits of a number of factors, and as a result, are often hard to test objectively, e.g. work–life balance policy... Moreover, Governments and other institutions have policies in the form of laws, regulations, procedures, administrative actions, incentives and voluntary practices. Frequently, resource allocations mirror policy decisions.
In contrast, policies to assist in objective decision-making are usually operational in nature and can be objectively tested, e.g. password policy.[1]
The term may apply to government, public sector organizations and groups, as well as individuals, Presidential executive orders, corporate privacy policies, and parliamentary rules of order are all examples of policy. Policy differs from rules or law. While the law can compel or prohibit behaviors (e.g. a law requiring the payment of taxes on income), policy merely guides actions toward those that are most likely to achieve the desired
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
