import React from "react";
import { connect, useDispatch } from "react-redux";
import LoadOnOpenAutoComplete from "./LoadOnOpenAutoComplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { actionSignUpConsultant } from "../actions/auth.actions";

function MenuConsultantSignUp({ user }) {
  const dispatch = useDispatch();
  const [ocupation, setOcupation] = React.useState(null);
  const [department, setDepartment] = React.useState(null);
  const [formValue, setFormValue] = React.useState({
    infirmary: "",
    academy: "",
    licenseNumber: "",
    personalID: "",
    media: null,
  });
  const { infirmary, academy, licenseNumber, personalID } = formValue;

  function sleep(delay = 1e3) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
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
  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(formValue).forEach((key) => {
      formData.append(key, formValue[key]);
    });
    formData.append("ocupation", ocupation.title);
    formData.append("department", department.title);
    dispatch(actionSignUpConsultant(formData));
  };

  const ocupationOptions = [
    { title: "แพทย์", value: "แพทย์" },
    { title: "พยาบาล", value: "พยาบาล" },
  ];
  const departmentOptions = [
    { title: "ตา", value: "ตา" },
    { title: "หู", value: "หู" },
  ];

  return (
    <>
      <LoadOnOpenAutoComplete
        label="อาชีพ"
        fetchFunc={sleep}
        optionsData={ocupationOptions}
        value={ocupation}
        setValue={setOcupation}
      />
      <LoadOnOpenAutoComplete
        label="แผนก"
        fetchFunc={sleep}
        optionsData={departmentOptions}
        value={department}
        setValue={setDepartment}
      />
      <TextField
        required
        label="สถานพยาบาล/คลินิก"
        name="infirmary"
        value={infirmary}
        onChange={handleChange}
      />
      <TextField
        required
        label="สถานศึกษา"
        name="academy"
        value={academy}
        onChange={handleChange}
      />
      <TextField
        required
        label="เลขที่ใบอนุญาติ"
        name="licenseNumber"
        value={licenseNumber}
        onChange={handleChange}
      />
      <TextField
        required
        label="รหัสประจำตัวประชาชน"
        name="personalID"
        value={personalID}
        onChange={handleChange}
      />
      <input
        type="file"
        name="media"
        accept="image/png, image/jpeg"
        onChange={handleChangeFiles}
        multiple
      />
      <Button onClick={handleSubmit}>สมัคร</Button>
    </>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(MenuConsultantSignUp);
