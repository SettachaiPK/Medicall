import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { Icon } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import { Avatar } from "@mui/material";
import { Box, typography } from "@mui/system";
import ShowReview from "./ShowReview";
import { TextField } from "@mui/material";
import { Button, Chip, Container } from "@mui/material";
import ConsultNowDetailsPopUp from "./ConsultNowDetailsPopUp";
import { useState } from "react";

function HomePageCard({
  consultant: {
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
  },
}) {
  const navigate = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenAdd = (event) => {
    setOpenAdd(true);
    event.stopPropagation();
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  return (
    <>
      <Box
        sx={{
          border: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          maxWidth: "fit-content",
          padding: 3,
          margin: 3,
        }}
        onClick={() => {
          navigate(`/consultant/${userID}`);
        }}
      >
        {onlineStatus}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            aria-label="Example"
            onClick={() => {
              console.log("like");
            }}
          >
            <SvgIcon component={FavoriteIcon} />
          </IconButton>
          <label>{videoCallPrice} B/ 15 min</label>
        </Box>

        <Avatar
          sx={{ width: 60, height: 60 }}
          src={`data:image/png;base64, ${avatar}`}
        />
        <typography>
          {firstName} {lastName}
        </typography>
        <Chip label={department}></Chip>
        <ShowReview />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <LocationOnIcon />
            <typography>{infirmary}</typography>
          </div>
          <div>
            <SchoolIcon />
            <typography>{academy}</typography>
          </div>
        </Box>

        <TextField
          margin="normal"
          sx={{ width: 300 }}
          required
          label="รายละเอียด"
          name="Consultant detail"
          value={detail}
          disabled
        />

        <Button>จองล่วงหน้า</Button>
        <Button onClick={handleOpenAdd}>ปรึกษาทันที</Button>
      </Box>
      <ConsultNowDetailsPopUp open={openAdd} onClose={handleCloseAdd} />
    </>
  );
}

HomePageCard.defaultProps = {
  consultant: {
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
