import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/system";
import { CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import { CardHeader } from "@mui/material";
import { Avatar } from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import { IconButton } from "@mui/material";
import { Checkbox } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";

export default function CallComponent() {
  return (
    <div>
      <Box sx={{ display: "flex", mt: "3%", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{ width: "40rem", height: "35rem", mr: "1%" }}
        >
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: pink[100] }}></Avatar>}
            title="Customer Name"
          />
          <CardMedia>
            <video className="video-active" playsInline muted autoPlay />
          </CardMedia>
          <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
            <Checkbox
              icon={<VolumeUpIcon sx={{ color: pink[100], fontSize: 40 }} />}
              checkedIcon={
                <VolumeMuteIcon sx={{ color: pink[100], fontSize: 40 }} />
              }
            />
            <IconButton>
              <CallEndIcon sx={{ color: pink[100], fontSize: 40 }} />
            </IconButton>
            <Checkbox
              icon={<VideocamOffIcon sx={{ color: pink[100], fontSize: 40 }} />}
              checkedIcon={
                <VideocamIcon sx={{ color: pink[100], fontSize: 40 }} />
              }
            />
          </CardActions>
        </Card>
        <Card variant="outlined" sx={{ width: "40rem", height: "35rem" }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: pink[100] }}></Avatar>}
            title="Consultant Name"
          />
          <CardMedia>
            <video className="video-active" playsInline muted autoPlay />
          </CardMedia>
        </Card>
      </Box>
    </div>
  );
}
