import { useEffect, useCallback, useState } from "react";
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
    consultantAvatar,
    department,
    infirmary,
    academy,
    avatar,
    rating,
    reviews,
  } = consultant;

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
            padding: "5%",
          }}
        >
          <div>
            <div>department: {department}</div>
            <div>infirmary: {infirmary}</div>
            <div>academy: {academy}</div>
          </div>
          <div>{parseFloat(rating).toFixed(2)}</div>
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
              margin: "auto",
              height: "4rem",
              border: 1,
              borderColor: grey[300],
              padding: "2%",
            }}
          >
            <div>detail: {detail}</div>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              margin: 1.5,
            }}
          >
            <Box sx={{ display: "grid", justifyItems: "center" }}>
              <Checkbox
                icon={<MessageIcon sx={{ color: grey[400], fontSize: 35 }} />}
                checkedIcon={
                  <MessageIcon sx={{ color: pink[100], fontSize: 35 }} />
                }
              />
              {messagePrice}
            </Box>
            <Box sx={{ display: "grid", justifyItems: "center" }}>
              <Checkbox
                icon={<VideocamIcon sx={{ color: grey[400], fontSize: 35 }} />}
                checkedIcon={
                  <VideocamIcon sx={{ color: pink[100], fontSize: 35 }} />
                }
              />
              {voiceCallPrice}
            </Box>
            <Box sx={{ display: "grid", justifyItems: "center" }}>
              <Checkbox
                icon={<CallIcon sx={{ color: grey[400], fontSize: 35 }} />}
                checkedIcon={
                  <CallIcon sx={{ color: pink[100], fontSize: 35 }} />
                }
              />
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
              padding: "2%",
              minHeight: "5rem",
            }}
          >
            {reviews.map((review) => (
              <div>
                <div>rating: {review.rating}</div>
                <div>reason: {review.reason}</div>
                <div>create date: {review.createDate}</div>
                <div>-----------------</div>
              </div>
            ))}
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
