import * as React from "react";
import SectionConsultantEdit from "../../components/SectionConsultantEdit";
import CalendarDashboard from "../../components/CalendarDashboard";
import { Box } from "@mui/system";

export default function DashBoard() {
  return (
    <>
    <Box sx={{width:"80%",m:"auto",p:"1rem"}}>
    <CalendarDashboard />
    </Box>
    <Box>
      <SectionConsultantEdit />
      </Box>
    </>
  );
}
