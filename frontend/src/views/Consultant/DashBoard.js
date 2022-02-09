import * as React from "react";
import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { styled } from "@mui/material/styles";
import { pink, grey } from "@mui/material/colors";
import CreateableAutoComplete from "../../components/CreateableAutoComplete";
import TextField from "@mui/material/TextField";
import { Divider } from "@mui/material";

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: "Very Satisfied",
  },
};

const StyledRating = styled(Rating)({
  "& .MuiRating-iconHover": {
    color: "#ff6d75",
  },
});

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function DashBoard() {
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

  return (
    <>
      <div style={{ display: "flex" }}>
        <label>คะแนนรีวิวเฉลี่ย :</label>
        <StyledRating
          readOnly
          sx={{ color: pink[100] }}
          name="highlight-selected-only"
          defaultValue={5}
          IconContainerComponent={IconContainer}
          highlightSelectedOnly
        />
      </div>
      <div className="Details_Box" style={{width:"30%"}}>
        <CreateableAutoComplete
          label="แผนก"
          optionsData={departmentOptions}
          value={department}
          setValue={setDepartment}
          disabled={!ocupation}
          variant="standard"
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          required
          label="สถานพยาบาล/คลินิก"
          name="infirmary"
          value={infirmary}
          onChange={handleChange}
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          required
          label="สถานศึกษา"
          name="academy"
          value={academy}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
