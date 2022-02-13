import { Button, Chip, Container } from "@mui/material";
import React from "react";
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

const price = "200 B/ 15 min";
const ConsultantName = "Consultant Name";
const Department = "Tag name";
const Hospital = "SomeWhere";
const College = "KMUTNB";
const Details = "Some Details";
export default function HomePageCard() {
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
          margin: 3
        }}
      >
        <Box sx={{width:"100%",display:"flex",alignItems: "center",justifyContent:"space-between"}}>
          <IconButton aria-label="Example">
            <SvgIcon component={FavoriteIcon} />
          </IconButton>
          <label>{price}</label>
        </Box>

        <Avatar sx={{ width: 60, height: 60 }} src="/broken-image.jpg" />
        <typography>{ConsultantName}</typography>
        <Chip label={Department}></Chip>
        <ShowReview />

        <Box sx={{width:"100%",display:"flex",alignItems: "center",justifyContent:"space-between"}}>
          <div>
            <LocationOnIcon />
            <typography>{Hospital}</typography>
          </div>
          <div>
            <SchoolIcon />
            <typography>{College}</typography>
          </div>
        </Box>

        <TextField
          margin="normal"
          sx={{ width: 300 }}
          required
          label="รายละเอียด"
          name="Consultant Details"
          value={Details}
          disabled
        />

        <Button>จองล่วงหน้า</Button>
        <Button>ปรึกษาทันที</Button>
      </Box>
    </>
  );
}
