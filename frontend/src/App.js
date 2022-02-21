import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
//import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage, UserMenuPage, DashBoard } from "./views";
import Topnav from "./components/Topnav";
import { actionVerifyLogIn } from "./actions/auth.actions";
import ConsultantDetailPage from "./views/Customer/ConsultantDetailPage";
import Call from "./views/Customer/Call";

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
    <Router>
      <Topnav />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="menu" element={<UserMenuPage />} />
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="consultant/:id" element={<ConsultantDetailPage />} />
        <Route path="call" element={<Call />} />
        {/* <Route exact path="/" element={<ProtectedRoute />}>
          <Route exact path="/protect" element={<HomePage />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
