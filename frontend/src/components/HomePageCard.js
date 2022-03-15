import { forwardRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Button,
  Chip,
  TextField,
  Avatar,
  SvgIcon,
  styled,
  tooltipClasses,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import ShowReview from "./ShowReview";
import ConsultNowDetailsPopUp from "./ConsultNowDetailsPopUp";
import { grey } from "@mui/material/colors";

function HomePageCard({
  consultant: {
    messagePrice,
    voiceCallPrice,
    videoCallPrice,
    firstName,
    lastName,
    department,
    infirmary,
    academy,
    detail,
    onlineStatus,
    userID,
    avatar,
    rating,
  },
}) {
  const navigate = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const handleOpenAdd = (event) => {
    setOpenAdd(true);
    event.stopPropagation();
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleToggleFavorite = (event) => {
    setFavorite(!favorite);
    event.stopPropagation();
  };

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor:
        onlineStatus === "online"
          ? "#7DE882"
          : onlineStatus === "busy"
          ? "#FF820F"
          : "#C4C4C4",
    },
  }));

  const MyShowReview = forwardRef(function MyComponent(props, ref) {
    return (
      <div {...props} ref={ref}>
        <ShowReview {...props} />
      </div>
    );
  });

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          width: "fit-content",
          maxWidth: 1,
          padding: 3,
          margin: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
          onClick={() => {
            navigate(`/consultant/${userID}`);
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <IconButton
              onClick={handleToggleFavorite}
              sx={{ color: favorite ? "#f9b1c7" : "", p: 0 }}
            >
              <SvgIcon component={FavoriteIcon} />
            </IconButton>
            <label className="color-primary">{videoCallPrice} B/ 15 min</label>
          </Box>
          <Box sx={{ position: "relative", width: 60, height: 60, mb: 2 }}>
            <Avatar
              sx={{ position: "absolute", width: 60, height: 60 }}
              src={`data:image/png;base64, ${avatar}`}
            />
            <StyledTooltip title={onlineStatus} placement="right-start">
              <CircleIcon
                sx={{
                  position: "absolute",
                  width: 20,
                  bottom: 0,
                  right: 0,
                  color:
                    onlineStatus === "online"
                      ? "#7DE882"
                      : onlineStatus === "busy"
                      ? "#FF820F"
                      : "#C4C4C4",
                }}
              />
            </StyledTooltip>
          </Box>

          <Typography>
            {firstName} {lastName}
          </Typography>
          <Chip size="small" label={department} sx={{ mb: 2 }} />
          <Tooltip
            title={`${rating ? parseFloat(rating).toFixed(2) : "No"} score`}
          >
            <MyShowReview rating={rating} />
          </Tooltip>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <div className="text-icon-wrapper">
              <img
                src="/assets/img/icon/Pin_duotone.svg"
                className="home-card-icon"
                alt=""
              />
              <Typography>{infirmary}</Typography>
            </div>
            <div className="text-icon-wrapper">
              <img
                src="/assets/img/icon/Square academic cap.svg"
                className="home-card-icon"
                alt=""
              />
              <Typography>{academy}</Typography>
            </div>
          </Box>

          <TextField
            margin="normal"
            sx={{ width: 300 }}
            multiline
            rows={3}
            size="small"
            label="รายละเอียด"
            value={detail ? detail : ""}
            inputProps={{ readOnly: true }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
          <Box
            sx={{
              width: 1,
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              variant="contained "
              endIcon={<img src="/assets/img/icon/calendar-edit.svg" alt="" />}
              sx={{ backgroundColor: "#AEEEEE", color: grey[600], px: 1 }}
              disabled
            >
              จองล่วงหน้า
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenAdd}
              disabled={onlineStatus !== "online"}
              endIcon={
                <img src="/assets/img/icon/message-square-lines.svg" alt="" />
              }
              sx={{ backgroundColor: "#FFC1C1", color: grey[600], px: 1 }}
            >
              ปรึกษาทันที
            </Button>
          </Box>
        </Box>
        <ConsultNowDetailsPopUp
          open={openAdd}
          onClose={handleCloseAdd}
          price={{ messagePrice, voiceCallPrice, videoCallPrice }}
          consultantID={userID}
        />
      </Paper>
    </>
  );
}

HomePageCard.defaultProps = {
  consultant: {
    messagePrice: 0,
    voiceCallPrice: 0,
    videoCallPrice: 0,
    department: "Tag name",
    infirmary: "SomeWhere",
    academy: "KMUTNB",
    detail: "Some detail",
    onlineStatus: "online",
    firstName: "first name",
    lastName: "last name",
    userID: 0,
  },
};

HomePageCard.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(HomePageCard);
