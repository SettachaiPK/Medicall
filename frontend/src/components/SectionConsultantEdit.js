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
import { pink,grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { Avatar, Grid } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { Box } from "@mui/system";

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
      <Grid
        container
        rowSpacing={0}
        columnSpacing={{ xs: 0, sm: 0, md: 0, lg: 0 }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "80%",
            m: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mr: 8,
              mt: 8,
            }}
          >
            <Avatar
              src={`data:image/png;base64, ${user.avatar}`}
              sx={{ width: "7rem", height: "7rem" }}
            />
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
              <Switch
                checked={checked}
                onChange={handleChecked}
                inputProps={{ "aria-label": "controlled" }}
              />
              <label>สถานะ: {formValue.onlineStatus} </label>
            </div>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                m: "auto",
                width: "100%",
                p: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <label>คะแนนรีวิวเฉลี่ย : </label>
              <StyledRating
                readOnly
                sx={{ color: pink[100], ml: "1rem" }}
                name="highlight-selected-only"
                value={formValue.rating}
                IconContainerComponent={IconContainer}
                highlightSelectedOnly
              />
            </Box>
            <Paper sx={{ display: "flex", p: "2rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                  variant="outlined"
                  margin="normal"
                  sx={{ width: 300 }}
                  label="รายละเอียด"
                  name="detail"
                  value={formValue.detail}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 5 }}>
                {tags.map((data, index) => {
                  return (
                    <Chip
                      key={index}
                      label={data}
                      onDelete={handleDeleteTag(data)}
                    />
                  );
                })}
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
                      color: grey[100],
                      fontWeight: 500,
                      fontSize: 20,
                    }}
                    onClick={handleSubmit}
                  >
                    ยืนยัน
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Paper>
      </Grid>
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
