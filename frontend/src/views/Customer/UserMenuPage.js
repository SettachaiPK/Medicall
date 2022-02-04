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

function UserMenuPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = React.useState("ข้อมูลส่วนตัว");

  const menuOptions = [
    "ข้อมูลส่วนตัว",
    "ลงทะเบียนผู้ให้คำปรึกษา",
    "ลงทะเบียนร้านเวชภัณฑ์",
    "ร้องเรียน",
  ];

  const handleMenuItemClick = (event, option) => {
    setStep(option);
  };
  const handleLogOut = async () => {
    await dispatch(actionLogout());
    await navigate("/home");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <MenuList>
          {menuOptions.map((option) => (
            <Box key={option}>
              <MenuItem onClick={(event) => handleMenuItemClick(event, option)}>
                <ListItemText>{option}</ListItemText>
              </MenuItem>
              <Divider />
            </Box>
          ))}
          <MenuItem onClick={handleLogOut}>
            <ListItemText>ออกจากระบบ</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
      <Box>
        {step === "ข้อมูลส่วนตัว" && <MenuProfile />}
        {step === "ลงทะเบียนผู้ให้คำปรึกษา" && (
          <div>ลงทะเบียนผู้ให้คำปรึกษา</div>
        )}
      </Box>
    </Box>
  );
}

UserMenuPage.defaultProps = {};
UserMenuPage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(UserMenuPage);
