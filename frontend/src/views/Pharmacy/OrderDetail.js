import { Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { grey } from '@mui/material/colors';
import { Button } from '@mui/material';
const Address = "xx/xxxx";
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
  const pharmacy ="pharmacy_name";
export default function OrderDetail() {
  return (
    <div>
        <Box sx={{width:"45rem",m:"auto",p:"1rem"}}>
        <Paper sx={{p:"1rem",m:"1rem"}}>
            <Typography>ที่อยู่สำหรับจัดส่ง</Typography>
            <Typography sx={{color: grey[500],p:"1rem"}}>{Address}</Typography>
        </Paper>
        <Box sx={{m:"1rem"}}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="left" colSpan={3}>
                  {pharmacy}
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
              {rows.map((row) => (
                <TableRow key={row.desc}>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell align="left">{row.qty}</TableCell>
                  <TableCell align="left">{row.unit}</TableCell>
                  <TableCell align="left">{ccyFormat(row.price)}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="left">
                  {ccyFormat(invoiceTotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tax</TableCell>
                <TableCell align="left">{ccyFormat(shippingCost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="left">{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
        <Box sx={{ width: "44rem",display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row"}}>
        <Button sx={{ color: grey[500],textDecoration:"underline",height:"2rem",width:"6rem"}}>จัดส่งแล้ว</Button>
        <Button sx={{ backgroundColor: "#FFC1C1", color: grey[500],height:"2rem",width:"6rem"}}>จัดส่งแล้ว</Button>
        </Box>
        </Box>
    </div>
  )
}
