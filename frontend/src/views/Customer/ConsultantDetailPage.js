import { useEffect, useCallback, useState } from "react";
import * as React from "react";
import { useParams } from "react-router-dom";
import { ConsultantDetailModel } from "../../models";
import { getConsultantDetail } from "../../service/customer.service";
import { Box } from "@mui/system";
import { Avatar, Paper } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import { Button } from "@mui/material";
import { grey, pink } from "@mui/material/colors";
import { Checkbox } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { CssBaseline } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Accordion } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import { AccordionSummary } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import GradeIcon from '@mui/icons-material/Grade';
import { Chip } from "@mui/material";

function ConsultantDetailPage() {
  const { id } = useParams();
  const [consultant, setConsultant] = useState(new ConsultantDetailModel());
  const {
    firstName,
    lastName,
    detail,
    messagePrice,
    voiceCallPrice,
    videoCallPrice,
    onlineStatus,
    department,
    infirmary,
    academy,
    avatar,
    rating,
    reviews,
  } = consultant;

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
  

  const fetchDetail = useCallback(async () => {
    const { data } = await getConsultantDetail(id);
    await console.log(data);
    setConsultant(data);
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}>
      <div className="flex_column_center">
        <Avatar
          sx={{ width: 80, height: 80, mb: "1rem" }}
          src={`data:image/png;base64, ${avatar}`}
        />
        <div className="flex_column_center">
          <label>{firstName}</label>
          <label>{lastName}</label>
        </div>
        <div>{onlineStatus}</div>
      </div>
      <br />
      <div style={{ marginLeft: "4%" }}>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "30rem",
            height: "max-content",
            padding: "3%",
          }}
        >
          <div>
            <Chip size="small" label={department} sx={{ mb: 1 }} />
            <div className="text-icon-wrapper">
            <img
                src="/assets/img/icon/Pin_duotone.svg"
                className="home-card-icon"
                alt=""
              />
            <Typography sx={{fontSize:"80%"}}>{infirmary}</Typography>
            </div>
            <div className="text-icon-wrapper">
            <img
                src="/assets/img/icon/Square academic cap.svg"
                className="home-card-icon"
                alt=""
              />
            <Typography sx={{fontSize:"80%"}}>{academy}</Typography>
            </div>
          </div>
          <div style={{display:"flex", alignItems:"center"}}>
          <Typography sx={{fontSize:"2rem"}}>{parseFloat(rating).toFixed(2)}</Typography>
          <GradeIcon sx={{ color: pink[100], fontSize: 20 }}/>
          </div>
        </Paper>
        <br />
        <Paper
          sx={{
            width: "40rem",
            padding: "3%",
          }}
        >
          <Accordion>
            <AccordionDetails expandIcon={<ExpandMore />} sx={{minHeight:"7rem"}}>
              <Typography>{detail}</Typography>
            </AccordionDetails>
          </Accordion>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              margin: 1.5,
            }}
          >
            <Box sx={{ display: "grid", justifyItems: "center" }}>
                  <MessageIcon sx={{ color: pink[100], fontSize: 35 }} />
              {messagePrice}
            </Box>
            <Box sx={{ display: "grid", justifyItems: "center" }}>
                  <VideocamIcon sx={{ color: pink[100], fontSize: 35 }} />
              {voiceCallPrice}
            </Box>
            <Box sx={{ display: "grid", justifyItems: "center" }}>
                  <CallIcon sx={{ color: pink[100], fontSize: 35 }} />
              {videoCallPrice}
            </Box>
          </Box>
        </Paper>
        <br />
        <Paper
          sx={{
            width: "40rem",
            padding: "3%",
          }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: grey[300],
              maxHeight: "7rem",
              overflow: "auto",
            }}
          >
            <CssBaseline />
            <List>
              {reviews.map((review, index) => (
                <ListItem button key={index}>
                  <ListItemText
                    primary={<StyledRating
                      readOnly
                      sx={{ color: pink[100] }}
                      name="highlight-selected-only"
                      value={review.rating}
                      IconContainerComponent={IconContainer}
                      highlightSelectedOnly
                    />}
                    secondary={
                      <React.Fragment>
                        <Typography>reason: {review.reason}</Typography>
                        create date: {review.createDate}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
        <Box sx={{ p: "6%", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button sx={{ backgroundColor: "#AEEEEE" }} variant="contained">
              จองล่วงหน้า
            </Button>
            <Button sx={{ ml: "3rem" }} variant="contained">
              ปรึกษาทันที
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default ConsultantDetailPage;

