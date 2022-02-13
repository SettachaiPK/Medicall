import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, connect } from "react-redux";
import PropTypes from "prop-types";
import {
  actionGetServiceDetail,
  actionEditServiceDetail,
  actionEditServiceStatus,
} from "../actions/consultant.action";
import { actionChangeAvatar } from "../actions/auth.actions";
import CreateableAutoComplete from "./CreateableAutoComplete";
import { pink } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { Avatar } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

function SectionConsultantEdit({ consultant, user }) {
  const dispatch = useDispatch();
  //const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [addTag, setAddTag] = useState("");

  const [department, setDepartment] = useState({
    title: consultant.department,
    value: consultant.department,
  });
  const [departmentOptions, setDepartmentOptions] = useState([
    { title: "", value: "" },
  ]);

  const [formValue, setFormValue] = useState({ ...consultant });
  const { detail, messagePrice, voiceCallPrice, videoCallPrice, tags } =
    formValue;

  const hiddenFileInput = useRef(null);

  const handleChangeAvatar = async (event) => {
    const fileUploaded = event.target.files[0];
    const formData = new FormData();
    formData.append("media", fileUploaded);
    await dispatch(actionChangeAvatar(formData));
  };

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
        tags,
      })
    );
  };
  const handleDeleteTag = (chipToDelete) => () => {
    setFormValue((prevState) => {
      return {
        ...prevState,
        ["tags"]: prevState.tags.filter((chip) => chip !== chipToDelete),
      };
    });
  };
  const handleAddTag = () => {
    setFormValue((prevState) => {
      return {
        ...prevState,
        ["tags"]: prevState.tags.concat([addTag]),
      };
    });
  };

  const fetchServiceDetail = useCallback(async () => {
    //setLoading(true);
    await dispatch(actionGetServiceDetail());
    //setLoading(false);
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
      <Avatar src={`data:image/png;base64, ${user.avatar}`} />
      <input
        type="file"
        name="media"
        accept="image/png, image/jpeg"
        ref={hiddenFileInput}
        onChange={handleChangeAvatar}
        hidden
      />
      <Button
        onClick={() => {
          hiddenFileInput.current.click();
        }}
      >
        แก้ไขรูปภาพ
      </Button>
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
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            listStyle: "none",
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {tags.map((data, index) => {
            return (
              <Chip key={index} label={data} onDelete={handleDeleteTag(data)} />
            );
          })}
        </Paper>
        <TextField
          label="เพิ่ม tags"
          value={addTag}
          onChange={(event) => setAddTag(event.target.value)}
          InputProps={{
            endAdornment: <Button onClick={handleAddTag}>เพิ่ม</Button>,
          }}
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
          formValue.videoCallPrice != consultant.videoCallPrice ||
          formValue.tags != consultant.tags) && (
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
  user: state.user,
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
