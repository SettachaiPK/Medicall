import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
//import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage, UserMenuPage, DashBoard, TestMeetingPage } from "./views";
import Topnav from "./components/Topnav";
import AlertPopup from "./components/AlertPopup";
import { actionVerifyLogIn } from "./actions/auth.actions";
import ConsultantDetailPage from "./views/Customer/ConsultantDetailPage";
import { createTheme, ThemeProvider } from "@mui/material";
import ConsultingPage from "./views/ConsultingPage";
import ReviewPage from "./components/ReviewPage";
import ManageProduct from "./views/Pharmacy/ManageProduct";
import AddProduct from "./views/Pharmacy/AddProduct";
import EditProduct from "./views/Pharmacy/EditProduct";
import StorePage from "./views/Customer/StorePage";
import Cart from "./views/Pharmacy/Cart";
import PurchaseOrder from "./views/Pharmacy/PurchaseOrder";
import OrderDetail from "./views/Pharmacy/OrderDetail";
import DeliveryManagement from "./views/Pharmacy/DeliveryManagement";

const theme = createTheme({
  palette: { primary: { main: "#EEA9B8" } },
  typography: {
    fontFamily: "'Kanit', sans-serif",
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function handleVerifyLogIn() {
      const res = await dispatch(actionVerifyLogIn());
      if (res) {
      }
    }
    handleVerifyLogIn();
  }, [dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Topnav />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="menu" element={<UserMenuPage />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="consulting/:jobID" element={<ConsultingPage />} />
          <Route path="consultant/:id" element={<ConsultantDetailPage />} />
          <Route path="meeting/:jobID" element={<TestMeetingPage />} />
          <Route path="reviewpage" element={<ReviewPage />} />
          <Route path="product/manage" element={<ManageProduct />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="editproduct" element={<EditProduct />} />
          <Route path="product" element={<StorePage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="purchase" element={<PurchaseOrder />} />
          <Route path="orderdetail" element={<OrderDetail />} />
          <Route
            path="product/manage-delivery"
            element={<DeliveryManagement />}
          />
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
