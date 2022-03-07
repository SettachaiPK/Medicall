import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoginStep from "./LoginStep";
import {
  IconButton,
  Drawer,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

function Topnav({ user: { status, roles } }) {
  const [offsetY, setOffsetY] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const navItem = () => (
    <>
      <Link to="/">หน้าหลัก</Link>
      {roles.includes("consultant") && <Link to="/dashboard">กระดาน</Link>}
      <Link to="/product">ซื้อเวชภัณฑ์</Link>
      {/* <Link to="/hospital">ค้นหาสถานพยาบาล</Link> */}
      <Link to="/appointment">ประวัติการนัดหมาย</Link>
      {!status && (
        <a href onClick={handleOpenAdd}>
          เข้าสู่ระบบ
        </a>
      )}
      {status && <Link to="/menu">เมนู</Link>}
    </>
  );

  useEffect(() => {
    setOffsetY(window.pageYOffset);
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };
    window.addEventListener("scroll", handleScroll);
    return function cleanup() {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`topnav ${offsetY > 50 ? "sticky" : ""}`}>
        <div className="logo">
          <label>MEDICALL</label>
        </div>
        <div className="nav-menu">{navItem()}</div>

        <div className="nav-drawer-icon">
          <IconButton
            sx={{ color: "#f9b1c7" }}
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <Menu />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
            {navItem()}
          </Drawer>
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
