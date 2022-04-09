import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import { actionPlaceOrder } from "../../actions/customer.action";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const shippingCost = 0;
const invoiceTotal = shippingCost + invoiceSubtotal;
const pharmacy = "pharmcy_name";
const height = "5rem";

function PurchaseOrder(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { cart } = props;
  const [payment, setpayment] = React.useState("");
  const [orderDetail, setOrderDetail] = React.useState({
    storeID: null,
    storeName: "",
    orderDescription: "",
    deliveryLocation: "",
    deliveryChannel: "",
    paymentChannel: "",
    items: [],
    totalCost: 0,
  });

  const handleChange = (event) => {
    setpayment(event.target.value);
  };

  const handleChangeOrderDetail = (e, field) => {
    setOrderDetail({ ...orderDetail, [field]: e.target.value });
  };

  useEffect(() => {
    const selectedItems = JSON.parse(params.items);
    let storeName = "";
    let orderDescription = "";
    let items = [];
    let totalCost = 0;
    for (let index = 0; index < cart.orders.length; index++) {
      const order = cart.orders[index];
      if (String(order.storeID) === String(params.storeID)) {
        storeName = order.storeName;
        orderDescription = order.orderDescription;
        order.items.forEach((item) => {
          if (selectedItems.indexOf(item.productID) !== -1) {
            items.push(item);
            totalCost += item.productPrice * item.amount;
          }
        });
      }
    }
    setOrderDetail({
      storeID: params.storeID,
      storeName,
      orderDescription,
      deliveryLocation: cart.deliveryLocation,
      deliveryChannel: cart.deliveryChannel,
      paymentChannel: cart.paymentChannel,
      items,
      totalCost,
    });
  }, [params, cart]);
  return (
    <div>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ width: "45rem" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    {orderDetail.storeName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ชื่อสินค้า</TableCell>
                  <TableCell align="left">ราคา/ชิ้น</TableCell>
                  <TableCell align="left">จำนวน</TableCell>
                  <TableCell align="left">รวม</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetail.items.map((row) => (
                  <TableRow key={row.productID}>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell align="left">
                      {parseFloat(row.productPrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">
                      {parseFloat(row.productPrice * row.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="left">
                    {ccyFormat(orderDetail.totalCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Tax</TableCell>
                  <TableCell align="left">{ccyFormat(shippingCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="left">
                    {ccyFormat(orderDetail.totalCost)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TextField
          required
          value={orderDetail.deliveryLocation}
          onChange={(e) => handleChangeOrderDetail(e, "deliveryLocation")}
          multiline
          row={4}
          id="filled-required"
          label="ที่อยู่สำหรับจัดส่ง"
          variant="filled"
          sx={{ width: "45rem", margin: "2rem" }}
          inputProps={{
            style: {
              height,
            },
          }}
        />
        <Paper
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "45rem",
            padding: "0.5rem",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">
              ช่องทางการชำระเงิน
            </InputLabel>
            <Select
              value={payment}
              onChange={handleChange}
              sx={{ height: "3rem", width: "25rem", fontSize: "1rem" }}
              disabled
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <Button
            sx={{
              backgroundColor: "#FFC1C1",
              color: grey[500],
              height: "3rem",
              width: "10rem",
              fontSize: "1rem",
            }}
            onClick={async () => {
              const res = await props.actionPlaceOrder(orderDetail);
              if (res) {
                navigate(`/cart`);
              }
            }}
          >
            ชำระเงิน
          </Button>
        </Paper>
      </Box>
    </div>
  );
}

PurchaseOrder.defaultProps = {};
PurchaseOrder.propTypes = {};

const mapStateToProps = (state) => ({ cart: state.cart });

export default connect(mapStateToProps, { actionPlaceOrder: actionPlaceOrder })(
  PurchaseOrder
);
