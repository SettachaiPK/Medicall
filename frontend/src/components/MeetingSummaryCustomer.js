import { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import { actionGetJobSummary } from "../actions/customer.action";
import moment from "moment";

function MeetingSummaryCustomer(props) {
  const { jobID, actionGetJobSummary } = props;
  const [summary, setSummary] = useState({
    actualPeriod: "",
    advice: "",
    avatar: null,
    communicationChannel: "",
    firstName: "",
    lastName: "",
    meetStartDate: "",
    price: "",
  });
  useEffect(() => {
    async function fetch(jobID) {
      const data = await actionGetJobSummary(jobID);
      setSummary(data);
    }
    fetch(jobID);
  }, [jobID, actionGetJobSummary]);
  return (
    <div>
      <Paper
        elevation={4}
        sx={{
          width: "40rem",
          height: "40rem",
          margin: "auto",
          padding: "3%",
          marginTop: "2%",
          marginBottom: "2%",
        }}
      >
        <Box sx={{ margin: "auto", width: "fit-content" }}>
          <label style={{ color: pink[100], fontSize: "2rem" }}>
            ผลการปรึกษา
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Avatar
            sx={{ bgcolor: grey[300], height: "4rem", width: "4rem" }}
            src={`data:image/png;base64, ${summary.avatar}`}
          />
          <label style={{ padding: "0.5rem", fontSize: "18px" }}>
            {summary.firstName} {summary.lastName}
          </label>
          <Button
            sx={{
              color: pink[100],
              fontsize: "1rem",
              textDecoration: "underline",
            }}
          >
            เพิ่มในรายการโปรด
          </Button>
        </Box>
        <Box
          sx={{
            m: "0.5rem",
            p: "1rem",
            border: 1,
            borderRadius: 1,
            borderColor: grey[400],
          }}
        >
          <label>รายละเอียดการสนทนา :</label>
          <Box
            sx={{
              bgcolor: grey[300],
              height: "10rem",
              marginTop: "1rem",
              marginBottom: "1rem",
              padding: "1rem",
            }}
          >
            <label>คำแนะนำจากผู้ให้คำปรึกษา : {summary.advice}</label>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              padding: "0.5rem",
            }}
          >
            <Box sx={{ display: "grid" }}>
              <label>
                วันที่: {moment(summary.meetStartDate).format("DD-MM-YYYY")}
              </label>
              <label>
                เวลา: {moment(summary.meetStartDate).format("HH.mm")}
              </label>
              <label>
                เวลาทั้งหมด: {(summary.actualPeriod / 60).toFixed(2)} นาที
              </label>
            </Box>
            <Box sx={{ display: "grid" }}>
              <label>ชนิดของการสนทนา: {summary.communicationChannel}</label>
              <label>จำนวนเงินที่ชำระ: {summary.price} บาท</label>
              <label>ส่วนลดทั้งหมด: {0} บาท</label>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            m: "0.5rem",
            mt: "1rem",
            p: "1rem",
            border: 1,
            borderRadius: 1,
            borderColor: grey[400],
          }}
        >
          สินค้าที่แนะนำ
        </Box>
      </Paper>
    </div>
  );
}

MeetingSummaryCustomer.defaultProps = {};
MeetingSummaryCustomer.propTypes = {
  actionGetJobSummary: PropTypes.func.isRequired,
  jobID: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionGetJobSummary: actionGetJobSummary,
})(MeetingSummaryCustomer);
