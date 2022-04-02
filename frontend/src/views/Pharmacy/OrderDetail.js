import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { grey } from "@mui/material/colors";
import { Button } from "@mui/material";
import { actionGetOrderDetail } from "../../actions/pharmacy.actions";

function ccyFormat(num) {
  num = parseFloat(num);
  return `${num.toFixed(2)}`;
}

function OrderDetail(props) {
  const { orderID } = useParams();
  const { actionGetOrderDetail } = props;
  const [orderDetail, setOrderDetail] = useState({
    products: [],
    totalPrice: "0.0",
  });

  useEffect(() => {
    async function fetchProducts() {
      const res = await actionGetOrderDetail(orderID);
      console.log(res);
      setOrderDetail(res);
    }
    fetchProducts();
  }, [orderID, actionGetOrderDetail]);

  return (
    <div>
      <Box sx={{ width: "45rem", m: "auto", p: "1rem" }}>
        <Paper sx={{ p: "1rem", m: "1rem" }}>
          <Typography>ที่อยู่สำหรับจัดส่ง</Typography>
          <Typography sx={{ color: grey[500], p: "1rem" }}>
            {orderDetail.deliveryLocation}
          </Typography>
        </Paper>
        <Box sx={{ m: "1rem" }}>
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
                  <TableCell align="left">รวม(บาท)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetail.products.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell align="left">
                      {ccyFormat(row.pricePerPiece)}
                    </TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">
                      {ccyFormat(row.pricePerPiece * row.amount)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="left">
                    {ccyFormat(orderDetail.totalPrice)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Shipping Cost</TableCell>
                  <TableCell align="left">{ccyFormat(0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="left">
                    {ccyFormat(orderDetail.totalPrice)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            width: "44rem",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Button
            sx={{
              color: grey[500],
              textDecoration: "underline",
              height: "2rem",
              width: "6rem",
            }}
          >
            ยกเลิก
          </Button>
          <Button
            sx={{
              backgroundColor: "#FFC1C1",
              color: grey[500],
              height: "2rem",
              width: "6rem",
            }}
          >
            จัดส่งแล้ว
          </Button>
        </Box>
      </Box>
    </div>
  );
}

OrderDetail.defaultProps = {};
OrderDetail.propTypes = {
  actionGetOrderDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionGetOrderDetail: actionGetOrderDetail,
})(OrderDetail);
