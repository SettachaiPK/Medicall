import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { pink, grey } from "@mui/material/colors";
import {
  actionSignUpPhamarcy,
  actionCheckPendingPhamarcy,
} from "../actions/auth.actions";

function MenuPhamarcySignUp() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [pendingApplication, setPendingApplication] = React.useState(true);
  const [formValue, setFormValue] = React.useState({
    storeName: "",
    location: "",
    licenseNumber: "",
    personalID: "",
    media: null,
  });
  const { storeName, location, licenseNumber, personalID } = formValue;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const handleChangeFiles = (event) => {
    const { name, files } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: files,
      };
    });
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(formValue).forEach((key) => {
      formData.append(key, formValue[key]);
    });
    const res = await dispatch(actionSignUpPhamarcy(formData));
    setPendingApplication(res === false ? false : true);
  };

  const checkPendingApplication = React.useCallback(async () => {
    setLoading(true);
    const pending = await dispatch(actionCheckPendingPhamarcy());
    setPendingApplication(pending);
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    (() => {
      checkPendingApplication();
    })();
  }, [checkPendingApplication]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent:"flex-start"
        }}
      >
        {loading && <>loading</>}
        {!loading && (
          <>
            {!pendingApplication && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    margin="normal"
                    sx={{ width: 300 }}
                    required
                    label="ชื่อร้านค้า"
                    name="storeName"
                    value={storeName}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    sx={{ width: 300 }}
                    multiline
                    required
                    label="สถานที่ตั้ง"
                    name="location"
                    value={location}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    sx={{ width: 300 }}
                    required
                    label="เลขที่ใบอนุญาติ"
                    name="licenseNumber"
                    value={licenseNumber}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    sx={{ width: 300 }}
                    required
                    label="รหัสประจำตัวประชาชน"
                    name="personalID"
                    value={personalID}
                    onChange={handleChange}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginLeft: "5%",
                  }}
                >
                  <label
                    style={{
                      fontSize: "medium",
                      marginRight: "30%",
                      color: "grey",
                    }}
                  >
                    แนบภาพใบประกอบวิชาชีพ :
                  </label>
                  <input
                    type="file"
                    name="media"
                    accept="image/png, image/jpeg"
                    onChange={handleChangeFiles}
                    multiple
                  />
                  <Button
                    onClick={handleSubmit}
                    sx={{
                      marginTop: "100%",
                      background: pink[100],
                      color: grey[50],
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    สมัคร
                  </Button>
                </div>
              </>
            )}
            {pendingApplication && <>ใบสมัครอยู่ระหว่างพิจารณา</>}
          </>
        )}
      </div>
    </>
  );
}
export default MenuPhamarcySignUp;
