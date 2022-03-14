import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
import { actionGetJobDetail } from "../actions/customer.action";
import { actionGetJobDetailConsultant } from "../actions/consultant.action";

function CallComponent(props) {
  const context = useContext(SocketContext);
  const {
    actionGetJobDetail,
    actionGetJobDetailConsultant,
    jobID,
    consulting: { role },
    user,
  } = props;
  const [consultantDetail, setConsultantDetail] = useState({
    avatar: null,
    firstName: "Consultant",
    lastName: "Name",
  });
  const [customerDetail, setCustomerDetail] = useState({
    avatar: null,
    firstName: "Customer",
    lastName: "Name",
  });

  useEffect(() => {
    console.log(user);
    console.log(role);
    if (jobID && role === "customer") {
      async function fetchData() {
        const data = await actionGetJobDetail(jobID);
        setConsultantDetail(data);
        setCustomerDetail({
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
      fetchData();
    } else if (jobID && role === "consultant") {
      async function fetchData() {
        const data = await actionGetJobDetailConsultant(jobID);
        setCustomerDetail(data);
        setConsultantDetail({
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
      fetchData();
    }
  }, [jobID, role, user, actionGetJobDetail, actionGetJobDetailConsultant]);

  return (
    <div>
      <Box sx={{ display: "flex", mt: "3%", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{ width: "40rem", height: "35rem", mr: "1%" }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: pink[100] }}
                src={`data:image/png;base64, ${customerDetail.avatar}`}
              ></Avatar>
            }
            title={customerDetail.firstName + " " + customerDetail.lastName}
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
                  context.handleLeaveCall(props.advice);
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
            avatar={
              <Avatar
                sx={{ bgcolor: pink[100] }}
                src={`data:image/png;base64, ${consultantDetail.avatar}`}
              ></Avatar>
            }
            title={consultantDetail.firstName + " " + consultantDetail.lastName}
          />
          <CardMedia>
            <video className="video-active" playsInline muted autoPlay />
          </CardMedia>
        </Card>
      </Box>
    </div>
  );
}

CallComponent.defaultProps = { advice: "" };
CallComponent.propTypes = {
  consulting: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  actionGetJobDetail: PropTypes.func.isRequired,
  actionGetJobDetailConsultant: PropTypes.func.isRequired,
  advice: PropTypes.string,
};

const mapStateToProps = (state) => ({
  consulting: state.consulting,
  user: state.user,
});

export default connect(mapStateToProps, {
  actionGetJobDetail: actionGetJobDetail,
  actionGetJobDetailConsultant: actionGetJobDetailConsultant,
})(CallComponent);
