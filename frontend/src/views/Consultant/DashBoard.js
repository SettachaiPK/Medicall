import * as React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SectionConsultantEdit from "../../components/SectionConsultantEdit";
import CalendarDashboard from "../../components/CalendarDashboard";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import ManageSchedule from "../../components/ManageSchedule";
import { useNavigate } from "react-router-dom";
import { actionFetchBookedSchedule } from "../../actions/consultant.action";

function DashBoard(props) {
  const { actionFetchBookedSchedule } = props;
  const handleSubmit = () => {
    navigate(`../manage-schedule`);
  };
  const navigate = useNavigate();
  React.useEffect(() => {
    actionFetchBookedSchedule();
  }, [actionFetchBookedSchedule]);
  return (
    <>
      <Box sx={{ width: "80%", m: "auto", p: "1rem" }}>
        <Box
          sx={{
            justifyContent: "flex-end",
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={handleSubmit}
        >
          <Button variant="contained" sx={{ color: grey[200], mb: 3 }}>
            จัดการตารางเวลา
          </Button>
        </Box>
        <CalendarDashboard />
      </Box>
      <Box>
        <SectionConsultantEdit />
      </Box>
    </>
  );
}
DashBoard.defaultProps = {};
DashBoard.propTypes = {
  actionFetchBookedSchedule: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionFetchBookedSchedule: actionFetchBookedSchedule,
})(DashBoard);
