import React, { useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import PropTypes from "prop-types";
import {
  actionGetServiceDetail,
  actionEditServiceDetail,
  actionEditServiceStatus,
} from "../actions/consultant.action";
import CreateableAutoComplete from "./CreateableAutoComplete";
import { pink } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

function SectionConsultantEdit({ consultant }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState(true);

  const [department, setDepartment] = React.useState({
    title: consultant.department,
    value: consultant.department,
  });
  const [departmentOptions, setDepartmentOptions] = React.useState([
    { title: "", value: "" },
  ]);

  const [formValue, setFormValue] = React.useState({ ...consultant });
  const { detail, messagePrice, voiceCallPrice, videoCallPrice } = formValue;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const handleChecked = (event) => {
    setChecked(event.target.checked);
    setFormValue((prevState) => {
      return {
        ...prevState,
        ["onlineStatus"]: event.target.checked ? "online" : "offline",
      };
    });
    dispatch(
      actionEditServiceStatus({
        onlineStatus: event.target.checked ? "online" : "offline",
      })
    );
  };
  const handleSubmit = () => {
    dispatch(
      actionEditServiceDetail({
        detail,
        messagePrice,
        voiceCallPrice,
        videoCallPrice,
      })
    );
  };

  const fetchServiceDetail = React.useCallback(async () => {
    setLoading(true);
    await dispatch(actionGetServiceDetail());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    (() => {
      fetchServiceDetail();
    })();
  }, [fetchServiceDetail]);

  useEffect(() => {
    setFormValue({ ...consultant });
    setChecked(consultant.onlineStatus === "online");
  }, [consultant]);
  useEffect(() => {
    setDepartment({
      title: consultant.department,
      value: consultant.department,
    });
  }, [consultant.department]);

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
      <div style={{ display: "flex" }}>
        <Switch
          checked={checked}
          onChange={handleChecked}
          inputProps={{ "aria-label": "controlled" }}
        />
        <label>สถานะ: {formValue.onlineStatus} </label>
      </div>
      <div className="Details_Box" style={{ width: "30%" }}>
        <CreateableAutoComplete
          label="แผนก"
          optionsData={departmentOptions}
          value={department}
          setValue={setDepartment}
          variant="standard"
          disabled
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          required
          label="สถานพยาบาล/คลินิก"
          name="infirmary"
          value={formValue.infirmary}
          onChange={handleChange}
          disabled
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          required
          label="สถานศึกษา"
          name="academy"
          value={formValue.academy}
          onChange={handleChange}
          disabled
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          label="รายละเอียด"
          name="detail"
          value={formValue.detail}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          label="messagePrice"
          name="messagePrice"
          value={formValue.messagePrice}
          onChange={handleChange}
          type="number"
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          label="voiceCallPrice"
          name="voiceCallPrice"
          value={formValue.voiceCallPrice}
          onChange={handleChange}
          type="number"
        />
        <TextField
          variant="standard"
          margin="normal"
          sx={{ width: 300 }}
          label="videoCallPrice"
          name="videoCallPrice"
          value={formValue.videoCallPrice}
          onChange={handleChange}
          type="number"
        />

        {(formValue.detail != consultant.detail ||
          formValue.messagePrice != consultant.messagePrice ||
          formValue.voiceCallPrice != consultant.voiceCallPrice ||
          formValue.videoCallPrice != consultant.videoCallPrice) && (
          <Button
            sx={{
              m: "auto",
              background: pink[100],
              fontWeight: 900,
              fontSize: 20,
            }}
            onClick={handleSubmit}
          >
            ยืนยัน
          </Button>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  consultant: state.consultant,
});

export default connect(mapStateToProps)(SectionConsultantEdit);

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
