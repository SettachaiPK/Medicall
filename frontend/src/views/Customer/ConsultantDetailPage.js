import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { ConsultantDetailModel } from "../../models";
import { getConsultantDetail } from "../../service/customer.service";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";

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

  const fetchDetail = useCallback(async () => {
    const { data } = await getConsultantDetail(id);
    setConsultant(data);
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <div>
      <Avatar src={`data:image/png;base64, ${avatar}`} />
      <div className="flex">
        {firstName} {lastName}
      </div>
      <br />
      <div>status: {onlineStatus}</div>
      <br />
      <Box sx={{ border: 1, maxWidth: "fit-content",padding: "2%" }}>
      <div>
      <div>department: {department}</div>
      <div>infirmary: {infirmary}</div>
      <div>academy: {academy}</div> 
      </div>
      <div>Review</div>
      </Box>
      <br />
      <div>detail: {detail}</div>
      <div>messagePrice: {messagePrice}</div>
      <div>voiceCallPrice: {voiceCallPrice}</div>
      <div>videoCallPrice: {videoCallPrice}</div>
    </div>
  );
}

export default ConsultantDetailPage;
