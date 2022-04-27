import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

export default function DeliveryOrderDetails(props) {
  const navigate = useNavigate();
  return (
    <div>
      {props.orders.map((order) => (
        <>
          {order.orderStatus === props.orderStats && (
            <Box
              sx={{ width: "45rem", m: "auto", p: "1rem" }}
              onClick={() => {
                navigate(`/orderdetail/${order.orderID}`);
              }}
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" colSpan={5}>
                        {order.firstName} {order.lastName} (ID:
                        {order.customerID})
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ชื่อสินค้า</TableCell>
                      <TableCell align="left">ราคา/ชิ้น</TableCell>
                      <TableCell align="left">จำนวน</TableCell>
                      <TableCell align="left">รวม(บาท)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.products.map((product) => (
                      <TableRow key={(order.orderID, product.productID)}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell align="left">
                          {product.pricePerPiece}
                        </TableCell>
                        <TableCell align="left">{product.amount}</TableCell>
                        <TableCell align="left">
                          {ccyFormat(product.pricePerPiece * product.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell align="left" colSpan={3}>
                        ช่องทางการจัดส่ง
                      </TableCell>
                      <TableCell align="left" colSpan={1}>
                        {order.deliveryChannel}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left" colSpan={3}>
                        รวมทั้งหมด (บาท)
                      </TableCell>
                      <TableCell align="left" colSpan={1}>
                        {ccyFormat(parseFloat(order.totalPrice))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      ))}
    </div>
  );
}
DeliveryOrderDetails.defaultProps = { orderStats: "paid", orders: [] };
DeliveryOrderDetails.propTypes = {
  orderStats: PropTypes.string,
  orders: PropTypes.array,
};
