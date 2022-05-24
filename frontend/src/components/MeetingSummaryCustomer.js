import { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import {
  actionAddToCart,
  actionGetJobSummary,
} from "../actions/customer.action";
import moment from "moment";
import { TextField } from "@mui/material";

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
    recommendedProducts: [],
  });
  useEffect(() => {
    async function fetch(jobID) {
      const data = await actionGetJobSummary(jobID);
      setSummary(data);
    }
    fetch(jobID);
  }, [jobID, actionGetJobSummary]);
  const handleChangeAmount = (index, value) => {
    setSummary({
      ...summary,
      recommendedProducts: summary.recommendedProducts.map(
        (product, indexP) => {
          if (indexP === index) {
            return { ...product, amount: value };
          }
          return product;
        }
      ),
    });
  };
  return (
    <div>
      <Paper
        elevation={4}
        sx={{
          width: "60%",
          height: "max-content",
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
            sx={{ bgcolor: grey[300], height: "5rem", width: "5rem" }}
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
                เวลาทั้งหมด: {parseFloat(summary.actualPeriod).toFixed(2)} นาที
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
          สินค้าที่แนะนำ :
          {summary.recommendedProducts.map((product, index) => {
            return (
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  p: "1rem",
                  m: "1rem",
                }}
              >
                <Typography>{product.productName}</Typography>
                <Typography>
                  {parseFloat(product.productPrice).toFixed(2)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>จำนวน : </Typography>
                  <TextField
                    variant="outlined"
                    sx={{ width: "4rem", ml: 2 }}
                    type="number"
                    value={product.amount}
                    onChange={(e) => {
                      handleChangeAmount(index, e.target.value);
                    }}
                  />
                </Box>
                <Button
                  sx={{ textDecoration: "underline" }}
                  onClick={() => {
                    props.actionAddToCart(product);
                  }}
                >
                  เพื่มลงตะกร้า
                </Button>
              </Paper>
            );
          })}
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
  actionAddToCart: actionAddToCart,
})(MeetingSummaryCustomer);
