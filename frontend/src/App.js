import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
//import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage, UserMenuPage, DashBoard, TestMeetingPage } from "./views";
import Topnav from "./components/Topnav";
import AlertPopup from "./components/AlertPopup";
import { actionVerifyLogIn } from "./actions/auth.actions";
import ConsultantDetailPage from "./views/Customer/ConsultantDetailPage";
import Call from "./views/Customer/Call";
import CallConsultant from "./views/Consultant/CallConsultant";
import MeetingSummary from "./views/Customer/MeetingSummary";
import MeetingSummaryConsultant from "./components/MeetingSummaryConsultant";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: { primary: { main: "#EEA9B8" } },
  typography: {
    fontFamily: "Raleway, Arial",
  },
});

function App() {
  const dispatch = useDispatch();
  const handleVerifyLogIn = async () => {
    const res = await dispatch(actionVerifyLogIn());
    if (res) {
    }
  };

  useEffect(() => {
    handleVerifyLogIn();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Topnav />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="menu" element={<UserMenuPage />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="consultant/:id" element={<ConsultantDetailPage />} />
          <Route path="calling" element={<Call />} />
          <Route path="callconsultant" element={<CallConsultant />} />
          <Route path="summary" element={<MeetingSummary />} />
          <Route
            path="summaryconsultant"
            element={<MeetingSummaryConsultant />}
          />
          <Route path="meeting/:jobID" element={<TestMeetingPage />} />
          {/* <Route exact path="/" element={<ProtectedRoute />}>
      <Router>
        <Topnav />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="menu" element={<UserMenuPage />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="consultant/:id" element={<ConsultantDetailPage />} />
          <Route path="calling" element={<Call />} />
          <Route path="meeting/:jobID" element={<TestMeetingPage />} />
          {/* <Route exact path="/" element={<ProtectedRoute />}>
          <Route exact path="/protect" element={<HomePage />} />
        </Route> */}
        </Routes>
        <AlertPopup />
      </Router>
    </ThemeProvider>
  );
}

export default App;
