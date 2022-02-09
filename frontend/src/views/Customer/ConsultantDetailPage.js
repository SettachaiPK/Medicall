import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { ConsultantDetailModel } from "../../models";
import { getConsultantDetail } from "../../service/customer.service";

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
      {consultantAvatar}
      <div className="flex">
        {firstName} {lastName}
      </div>
      <br />
      <div>status: {onlineStatus}</div>
      <br />
      <div>department: {department}</div>
      <div>infirmary: {infirmary}</div>
      <div>academy: {academy}</div> 
      <br />
      <div>detail: {detail}</div>
      <div>messagePrice: {messagePrice}</div>
      <div>voiceCallPrice: {voiceCallPrice}</div>
      <div>videoCallPrice: {videoCallPrice}</div>
    </div>
  );
}

export default ConsultantDetailPage;
