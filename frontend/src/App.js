import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
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
import PurchaseOrder from "./views/Customer/PurchaseOrder";
import OrderDetail from "./views/Pharmacy/OrderDetail";
import DeliveryManagement from "./views/Pharmacy/DeliveryManagement";
import MeetingSummaryCustomer from "./components/MeetingSummaryCustomer";
import { actionInitCart, actionSaveCart } from "./actions/customer.action";
const theme = createTheme({
  palette: { primary: { main: "#EEA9B8" } },
  typography: {
    fontFamily: "'Kanit', sans-serif",
  },
});

function App(props) {
  const dispatch = useDispatch();
  const { actionInitCart } = props;

  useEffect(() => {
    async function handleVerifyLogIn() {
      const res = await dispatch(actionVerifyLogIn());
      if (res) {
      }
    }
    handleVerifyLogIn();
    actionInitCart();
  }, [dispatch, actionInitCart]);
  useEffect(() => {
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("unload", handleTabClosing);
    };
  });
  const handleTabClosing = () => {
    props.actionSaveCart(props.cart);
  };
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
          <Route path="orderdetail/:orderID" element={<OrderDetail />} />
          <Route
            path="product/manage-delivery"
            element={<DeliveryManagement />}
          />
          <Route path="customer-summary" element={<MeetingSummaryCustomer />} />
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

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, {
  actionInitCart: actionInitCart,
  actionSaveCart: actionSaveCart,
})(App);
