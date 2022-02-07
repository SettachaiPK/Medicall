import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { actionLogout } from "../../actions/auth.actions";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import MenuProfile from "../../components/MenuProfile";
import MenuConsultantSignUp from "../../components/MenuConsultantSignUp";
import { pink, grey } from "@mui/material/colors";


function UserMenuPage({ user: { roles } }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = React.useState("profile");

  const menuOptions = [
    { value: "profile", massage: "ข้อมูลส่วนตัว" },
    {
      value: "consultant sign up",
      massage: "ลงทะเบียนผู้ให้คำปรึกษา",
      hidden: roles.includes("consultant"),
    },
    {
      value: "phamarcy sign up",
      massage: "ลงทะเบียนร้านเวชภัณฑ์",
      hidden: roles.includes("phamarcy"),
    },
    { value: "report", massage: "ร้องเรียน" },
  ];

  const handleMenuItemClick = (event, option) => {
    setStep(option);
  };
  const handleLogOut = async () => {
    await dispatch(actionLogout());
    await navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Paper sx={{ width: 350, maxWidth: "100%" ,marginTop:15,background: pink[100],height:"fit-content"}}>
        <MenuList>
          {menuOptions.map((option) => (
            <Box key={option.value} hidden={option.hidden}>
              <MenuItem
                onClick={(event) => handleMenuItemClick(event, option.value)}
                
              >
                <ListItemText>{option.massage}</ListItemText>
              </MenuItem>
              <Divider sx={{borderColor: "white"}} />
            </Box>
          ))}
          <MenuItem onClick={handleLogOut}>
            <ListItemText>ออกจากระบบ</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
      <Box sx={{width:"100%",margin:5}}>
        {step === "profile" && <MenuProfile />}
        {step === "consultant sign up" && <MenuConsultantSignUp />}
      </Box>
    </Box>
  );
}

UserMenuPage.defaultProps = {};
UserMenuPage.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(UserMenuPage);
