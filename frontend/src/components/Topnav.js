import React from "react";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
      <div className="topnav">
        <div className="logo">
          <label>MEDICALL</label>
        </div>
        <div>
          <Link to="/">หน้าหลัก</Link>
          <Link to="/product">ซื้อเวชภัณฑ์</Link>
          <Link to="/hospital">ค้นหาสถานพยาบาล</Link>
          <Link to="/appointment">ประวัติการนัดหมาย</Link>
          {!status && <a onClick={handleOpenAdd}>เข้าสู่ระบบ</a>}
          {status && <Link to="/menu">เมนู</Link>}
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
