import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { ConsultantDetailModel } from "../../models";
import { getConsultantDetail } from "../../service/customer.service";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import { Button } from "@mui/material";

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
  } = consultant;

  const review = "review";

  const fetchDetail = useCallback(async () => {
    const { data } = await getConsultantDetail(id);
    setConsultant(data);
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
      <div className="flex_column_center">
        <Avatar
          sx={{ width: 60, height: 60 }}
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
        <Box
          sx={{
            display: "flex",
            border: 1,
            width: "max-content",
            padding: "5%",
          }}
        >
          <div>
            <div>department: {department}</div>
            <div>infirmary: {infirmary}</div>
            <div>academy: {academy}</div>
          </div>
          <div style={{ marginLeft: "150px", marginTop: "25px" }}>
            AvrgReview
          </div>
        </Box>
        <br />
        <Box
          sx={{
            minWidth: 400,
            maxHeight: 200,
            border: 1,
            padding: "5%",
          }}
        >
          <Box
            sx={{
              minWidth: 200,
              maxWidth: 350,
              minHeight: 50,
              maxHeight: 70,
              margin: "auto",
              border: 1,
              padding: "3%",
            }}
          >
            <div>detail: {detail}</div>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-around", margin: 2 }}
          >
            <div style={{ display: "grid" }}>
              <MessageIcon />
              {messagePrice}
            </div>
            <div style={{ display: "grid" }}>
              <VideocamIcon /> {voiceCallPrice}
            </div>
            <div style={{ display: "grid" }}>
              <CallIcon /> {videoCallPrice}
            </div>
          </Box>
        </Box>
        <br />
        <Box
          sx={{
            minWidth: 400,
            maxHeight: 200,
            border: 1,
            padding: "5%",
          }}
        >
          <Box
            sx={{
              minWidth: 50,
              border: 1,
              maxWidth: 50,
              padding: "5%",
            }}
          >
            <div>{review}</div>
          </Box>
        </Box>
        <Button>จองล่วงหน้า</Button>
        <Button>ปรึกษาทันที</Button>
      </div>
    </div>
  );
}

export default ConsultantDetailPage;
