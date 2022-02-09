import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { pink, grey } from "@mui/material/colors";
import {
  actionSignUpConsultant,
  actionCheckPendingConsultant,
} from "../actions/auth.actions";
import {
  actionGetOccupations,
  actionGetDepartment,
} from "../actions/customer.action";
import CreateableAutoComplete from "./CreateableAutoComplete";

function MenuConsultantSignUp() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [pendingApplication, setPendingApplication] = React.useState({
    pending: false,
    status: "",
  });
  const [ocupation, setOcupation] = React.useState({ title: "", value: "" });
  const [department, setDepartment] = React.useState({ title: "", value: "" });
  const [ocupationOptions, setOcupationOptions] = React.useState([
    { title: "", value: "" },
  ]);
  const [departmentOptions, setDepartmentOptions] = React.useState([
    { title: "", value: "" },
  ]);
  const [formValue, setFormValue] = React.useState({
    infirmary: "",
    academy: "",
    licenseNumber: "",
    personalID: "",
    media: null,
  });
  const { infirmary, academy, licenseNumber, personalID } = formValue;

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
    formData.append("ocupation", ocupation.title);
    formData.append("department", department.title);
    const res = await dispatch(actionSignUpConsultant(formData));
    setPendingApplication(
      res === false
        ? {
            pending: false,
            status: "",
          }
        : {
            pending: true,
            status: "waiting approval",
          }
    );
  };

  const fetchFuncOccupation = React.useCallback(async () => {
    const occupations = await dispatch(actionGetOccupations());
    setOcupationOptions(occupations);
  }, [dispatch]);
  const fetchFuncDepartment = React.useCallback(async () => {
    const department = await dispatch(actionGetDepartment(ocupation.title));
    setDepartmentOptions(department);
  }, [dispatch, ocupation.title]);
  const checkPendingApplication = React.useCallback(async () => {
    setLoading(true);
    const data = await dispatch(actionCheckPendingConsultant());
    await setPendingApplication(data);
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    (() => {
      checkPendingApplication();
      fetchFuncOccupation();
    })();
  }, [fetchFuncOccupation, checkPendingApplication]);
  useEffect(() => {
    fetchFuncDepartment();
  }, [ocupation, fetchFuncDepartment]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        {loading && <>loading</>}
        {!loading && (
          <>
            {!pendingApplication.pending && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CreateableAutoComplete
                    label="อาชีพ"
                    optionsData={ocupationOptions}
                    value={ocupation}
                    setValue={setOcupation}
                  />
                  <CreateableAutoComplete
                    label="แผนก"
                    optionsData={departmentOptions}
                    value={department}
                    setValue={setDepartment}
                    disabled={!ocupation}
                  />
                  <TextField
                    margin="normal"
                    sx={{ width: 300 }}
                    required
                    label="สถานพยาบาล/คลินิก"
                    name="infirmary"
                    value={infirmary}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    sx={{ width: 300 }}
                    required
                    label="สถานศึกษา"
                    name="academy"
                    value={academy}
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
                    style={{ paddingTop: "5%", paddingBottom: "5%" }}
                    type="file"
                    name="media"
                    accept="image/png, image/jpeg"
                    onChange={handleChangeFiles}
                    multiple
                  />
                  <Button
                    onClick={handleSubmit}
                    sx={{
                      marginTop: "145%",
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
            {pendingApplication.pending &&
              pendingApplication.status == "active" && (
                <>ได้รับการอนุมัติแล้ว</>
              )}
            {pendingApplication.pending &&
              pendingApplication.status == "waiting approval" && (
                <>ใบสมัครอยู่ระหว่างพิจารณา</>
              )}
            {pendingApplication.pending &&
              pendingApplication.status == "inactive" && <>บัญชีถูกระงับ</>}
          </>
        )}
      </div>
    </>
  );
}
export default MenuConsultantSignUp;
