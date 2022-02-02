import React from "react";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { actionLogout } from "../actions/auth.actions";
import LoginStep from "./LoginStep";
function Topnav({ user: { status } }) {
  const dispatch = useDispatch();
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  const handleLogOut = () => {
    dispatch(actionLogout());
  };

  return (
    <>
      <div class="topnav">
        <div class="logo">
          <label>MEDICALL</label>
        </div>
        <div>
          <a href="#home">หน้าหลัก</a>
          <a href="#product">ซื้อเวชภัณฑ์</a>
          <a href="#hospital">ค้นหาสถานพยาบาล</a>
          <a href="#appointment">ประวัติการนัดหมาย</a>
          {!status && <a onClick={handleOpenAdd}>เข้าสู่ระบบ</a>}
          {status && <a onClick={handleLogOut}>ออกจากระบบ</a>}
        </div>
      </div>
      <LoginStep open={openAdd} onClose={handleCloseAdd} />
    </>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Topnav);
