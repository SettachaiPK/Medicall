import React from "react";
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
const pharmacy ="pharmcy_name";
const height = "5rem";

export default function PurchaseOrder() {
  const [payment, setpayment] = React.useState('');

  const handleChange = (event) => {
    setpayment(event.target.value);
  };
  return (
    <div>
      <Box sx={{display: "flex",flexDirection: "column",alignItems: "center"}}>
      <Box sx={{width:"45rem"}}>
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
        <TextField
          required
          multiline
          row={4}
          id="filled-required"
          label="ที่อยู่สำหรับจัดส่ง"
          variant="filled"
          sx={{width: "45rem", margin: "2rem"}}
          inputProps={{
            style: {
              height,
            },
          }} />
      <Paper sx={{ display: "flex",flexDirection: "row",justifyContent: "space-between",alignItems: "center",width: "45rem",padding: "0.5rem"}}>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={payment}
          label="ช่องทางการชำระเงิน"
          onChange={handleChange}
          sx={{height:"2rem",width:"25rem"}}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
        <Button sx={{ backgroundColor: "#FFC1C1", color: grey[500],height:"2rem",width:"8rem"}}>ชำระเงิน</Button>
        </Paper>
      </Box>
    </div>
  );
}
