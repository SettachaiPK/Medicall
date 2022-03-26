import React from 'react';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
  
  
  const rows = [
    createRow("Paperclips (Box)", 100, 1.15),
    createRow("Paper (Case)", 10, 45.99),
    createRow("Waste Basket", 2, 17.99),
  ];
  
  const customer ="customer name";
  const id = "xx-xxxx";

export default function DeliveryOrderDetails() {
  return (
    <div>
    <Box sx={{width:"45rem",m:"auto",p:"1rem"}}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="left" colSpan={3}>
                  {customer} (ID:{id})
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
              {rows.map((row) => (
                <TableRow key={row.desc}>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell align="left">{row.qty}</TableCell>
                  <TableCell align="left">{row.unit}</TableCell>
                  <TableCell align="left">{ccyFormat(row.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> 
    </Box>
    </div>
  )
}
