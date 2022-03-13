import { TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { pink, grey } from "@mui/material/colors";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { actionGetCustomerDetail } from "../actions/consultant.action";

function CustomerCallDetails(props) {
  const CustomerName = "customer name";
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    sex: "",
    congenitalDisease: "",
    drugInUse: "",
    drugAllergy: "",
    age: { days: 0, hours: 0, years: 0 },
    height: "0",
    weight: "0",
  });
  const hiddenFileInput = useRef(null);
  const {
    consulting: { role, jobID },
    actionGetCustomerDetail,
  } = props;

  useEffect(() => {
    if (jobID && role === "consultant") {
      async function fetchData() {
        const data = await actionGetCustomerDetail(jobID);
        await setProfile(data);
        await console.log(data);
      }
      fetchData();
    }
  }, [jobID, role, actionGetCustomerDetail]);

  return (
    <div style={{ display: "flex" }}>
      <Box
        sx={{
          mt: "10%",
          mr: "10%",
          border: 1,
          borderColor: grey[300],
          width: "20rem",
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            borderBottom: 1,
            borderColor: grey[300],
          }}
        >
          {<Avatar sx={{ bgcolor: pink[100] }}></Avatar>}
          <Typography sx={{ p: 2, fontSize: 20 }}>{CustomerName}</Typography>
        </Box>
        <Box sx={{ p: 5 }}>
          <Typography sx={{ pb: 1, fontSize: 16 }}>
            อายุ: {profile.age.years} ปี
          </Typography>
          <Typography sx={{ pb: 1, fontSize: 16 }}>
            เพศกำเนิด: {profile.sex}
          </Typography>
          <Typography sx={{ pb: 1, fontSize: 16 }}>
            โรคประจำตัว: {profile.congenitalDisease}{" "}
          </Typography>
          <Typography sx={{ pb: 1, fontSize: 16 }}>
            ยาที่รับประทานอยู่ : {profile.drugInUse}
          </Typography>
          <Typography sx={{ pb: 1, fontSize: 16 }}>
            ประวัติแพ้ยา: {profile.drugAllergy}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

CustomerCallDetails.defaultProps = {};
CustomerCallDetails.propTypes = {
  consulting: PropTypes.object.isRequired,
  actionGetCustomerDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  consulting: state.consulting,
});

export default connect(mapStateToProps, {
  actionGetCustomerDetail: actionGetCustomerDetail,
})(CustomerCallDetails);
