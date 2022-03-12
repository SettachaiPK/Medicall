import { useContext } from "react";
import {
  Card,
  CardMedia,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/system";
import { pink } from "@mui/material/colors";
import {
  VolumeUp as VolumeUpIcon,
  VolumeMute as VolumeMuteIcon,
  CallEnd as CallEndIcon,
  VideocamOff as VideocamOffIcon,
  Videocam as VideocamIcon,
} from "@mui/icons-material";
import { SocketContext } from "../helpers/Context";

export default function CallComponent() {
  const context = useContext(SocketContext);
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
              <CallEndIcon
                sx={{ color: pink[100], fontSize: 40 }}
                onClick={() => {
                  context.handleLeaveCall();
                }}
              />
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
