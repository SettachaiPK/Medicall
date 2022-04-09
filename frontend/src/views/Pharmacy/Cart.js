import React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useState } from "react";
import { connect } from "react-redux";
import {
  actionCartItemDelete,
  actionCartItemIncrease,
} from "../../actions/customer.action";
import { useNavigate } from "react-router-dom";

function createData(name, price, amount, total_price) {
  return {
    name,
    price,
    amount,
    total_price,
  };
}

const Pharmacy = "pharmacy_name";

const rows = [
  createData("Cupcake", 305, 3.7, 67),
  createData("Donut", 452, 25.0, 51),
  createData("Eclair", 262, 16.0, 24),
  createData("Frozen yoghurt", 159, 6.0, 24),
];

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "ชื่อสินค้า",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "ราคา",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "จำนวน",
  },
  {
    id: "total_price",
    numeric: true,
    disablePadding: false,
    label: "ทั้งหมด",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    isThisStore,
  } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={
              numSelected > 0 && numSelected === rowCount && isThisStore
            }
            checked={rowCount > 0 && numSelected === rowCount && isThisStore}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  isThisStore: PropTypes.bool.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, isThisStore } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 &&
          isThisStore && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
      }}
    >
      {numSelected > 0 && isThisStore ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.tableName}
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  isThisStore: PropTypes.bool.isRequired,
};

function EnhancedTable(props) {
  const { cart, actionCartItemDelete } = props;
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState([]);
  const [selectedStore, setSelectedStore] = React.useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleSelectAllClick = (event, storeID, items) => {
    if (event.target.checked) {
      const newSelecteds = items.map((n) => n.productID);
      setSelected(newSelecteds);
      setSelectedStore(storeID);
      return;
    }
    setSelected([]);
    setSelectedStore("");
  };

  const handleClick = (event, storeID, name) => {
    let newSelected = [];
    if (storeID === selectedStore) {
      const selectedIndex = selected.indexOf(name);

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
    } else {
      setSelectedStore(storeID);
      newSelected.push(name);
    }
    setSelected(newSelected);
  };
  const handelDelete = (orderIndex, itemIndex, storeID, productID) => {
    actionCartItemDelete({ orderIndex, itemIndex });
    if (selectedStore === storeID) {
      const selectedIndex = selected.indexOf(productID);
      let newSelected = [];
      if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, itemIndex),
          selected.slice(itemIndex + 1)
        );
      }
      setSelected(newSelected);
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const [count, setCount] = React.useState(1);

  return (
    <>
      <Box sx={{ padding: "6rem" }}>
        {cart.orders.map((store, orderIndex) => {
          return (
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                tableName={store.storeName}
                isThisStore={store.storeID === selectedStore}
              />
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={store.items.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={(e) =>
                      handleSelectAllClick(e, store.storeID, store.items)
                    }
                    rowCount={selected.length}
                    isThisStore={store.storeID === selectedStore}
                  />
                  <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                    {store.items.map((row, itemIndex) => {
                      const isItemSelected = isSelected(row.productID);
                      const labelId = `enhanced-table-checkbox-${itemIndex}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.productID}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              onClick={(event) =>
                                handleClick(event, store.storeID, row.productID)
                              }
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell align="left">{row.productName}</TableCell>
                          <TableCell align="left">
                            {parseFloat(row.productPrice).toFixed(2)}
                          </TableCell>
                          <TableCell align="left">
                            <TextField
                              value={row.amount}
                              onChange={(e) => {
                                props.actionCartItemIncrease({
                                  value: e.target.value,
                                  orderIndex,
                                  itemIndex,
                                });
                              }}
                              sx={{ width: "5rem", marginRight: "0.5rem" }}
                              type="number"
                            />
                          </TableCell>
                          <TableCell align="left">
                            {(
                              parseFloat(row.productPrice) *
                              parseFloat(row.amount)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => {
                                handelDelete(
                                  orderIndex,
                                  itemIndex,
                                  store.storeID,
                                  row.productID
                                );
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          );
        })}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", p: 2, width: "90%" }}
      >
        <Button
          sx={{ backgroundColor: "#FFC1C1", color: grey[500], height: "3rem" }}
          onClick={() => {
            navigate(`/purchase/${selectedStore}/${JSON.stringify(selected)}`);
          }}
        >
          สั่งซื้อสินค้า
        </Button>
      </Box>
    </>
  );
}

EnhancedTable.defaultProps = {};
EnhancedTable.propTypes = {};

const mapStateToProps = (state) => ({ cart: state.cart });

export default connect(mapStateToProps, {
  actionCartItemIncrease: actionCartItemIncrease,
  actionCartItemDelete: actionCartItemDelete,
})(EnhancedTable);
