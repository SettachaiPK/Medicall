import React, { useEffect } from "react";
import { connect } from "react-redux";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";

function MenuProfile({ user }) {
  const [profile, setProfile] = React.useState({ ...user });

  useEffect(() => {
    console.log(user);
    setProfile({ ...user });
  }, [user]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar src={`data:image/png;base64, ${profile.avatar}`} />
          <Button>แก้ไขรูปภาพ</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "row", margin: "auto" }}>
          <div
            style={{
              display: "grid",
            }}
          >
            <TextField
              margin="normal"
              label="เบอร์โทรศัพท์"
              name="phoneNumber"
              value={profile.phoneNumber || ""}
            />
            <TextField
              margin="normal"
              label="ชื่อ"
              name="firstName"
              value={profile.firstName || ""}
            />
            <TextField
              margin="normal"
              label="นามสกุล"
              name="lastName"
              value={profile.lastName || ""}
            />
            <TextField
              margin="normal"
              label="วันเกิด"
              name="birthDate"
              value={profile.birthDate || ""}
            />
            <FormControl margin="normal" sx={{ pl: 1 }}>
              <FormLabel id="demo-controlled-radio-buttons-group">
                เพศกำเนิด
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="sex"
                value={profile.sex}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="หญิง"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="ชาย"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "5%",
            }}
          >
            <TextField
              margin="normal"
              label="โรคประจำตัว"
              name="congenitalDisease"
              value={profile.congenitalDisease || ""}
            />
            <TextField
              margin="normal"
              label="ประวัติการแพ้ยา"
              name="drugAllergy"
              value={profile.drugAllergy || ""}
            />
            <TextField
              margin="normal"
              label="ยาที่ทานอยู่"
              name="drugInUse"
              value={profile.drugInUse || ""}
            />
          </div>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(MenuProfile);
