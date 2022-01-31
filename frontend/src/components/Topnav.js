import React from "react";
import { useState } from "react";
import LoginStep from "./LoginStep";
function Topnav(props) {
  const [openAdd, setOpenAdd] = useState(false);
  
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
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
        <a onClick={handleOpenAdd}>เข้าสู่ระบบ</a>
        </div>
      </div>
      <LoginStep
        open={openAdd}
        onClose={handleCloseAdd}
      />
    </>
  );
}
export default Topnav;
