import { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const selectFormStyles = {
  width: 175,
  ml: 2,
  display: { md: "flex", sm: "none", xs: "none" },
};

function SearchConsult(props) {
  const [occupation, setOccupation] = useState("");
  const [department, setDepartment] = useState("");
  const handleChange = () => {};
  return (
    <form action="/" method="get">
      <div className="search-container">
        <div className="search-box">
          <Autocomplete
            multiple
            id="tags-standard"
            options={top100Films}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="Search" />
            )}
          />
        </div>
        <FormControl sx={selectFormStyles}>
          <InputLabel id="demo-simple-select-label">อาชีพ</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={occupation}
            label="อาชีพ"
            onChange={handleChange}
          >
            <MenuItem value={"doctor"}>หมอ</MenuItem>
            <MenuItem value={"nurse"}>พยาบาล</MenuItem>
            <MenuItem value={"phamarcy"}>เภสัชกร</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={selectFormStyles}>
          <InputLabel id="demo-simple-select-label">แผนก</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={department}
            label="แผนก"
            onChange={handleChange}
          >
            <MenuItem value={"doctor"}>หู</MenuItem>
            <MenuItem value={"nurse"}>ตา</MenuItem>
            <MenuItem value={"phamarcy"}>จมูก</MenuItem>
          </Select>
        </FormControl>
      </div>
    </form>
  );
}

export default SearchConsult;

const top100Films = [
  { title: "headache" },
  { title: "อาเจียน" },
  { title: "คลื่นไส้" },
  { title: "ปวดหัว" },
  { title: "ปวดท้อง" },
  { title: "eye discomfort" },
  { title: "unable to breath" },
];
