import { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import {
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Circle as CircleIcon } from "@mui/icons-material";

const dotStyles = {
  width: 10,
  height: 10,
};
function FavoriteBar(props) {
  const consultants = [
    { onlineStatus: "online" },
    { onlineStatus: "busy" },
    { onlineStatus: "offline" },
  ];
  return (
    <div className="favbar-container">
      <div className="favbar-wrapper">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h7" color="primary" fontWeight="fontWeightBold">
            รายการโปรด
          </Typography>
          <Box sx={{ display: "flex", marginLeft: 3 }}>
            {consultants.map((consultant, index) => {
              return (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    marginRight: 2,
                    position: "relative",
                  }}
                >
                  <Avatar
                    sx={{ position: "absolute", width: 40, height: 40 }}
                  />
                  <CircleIcon
                    sx={{
                      position: "absolute",
                      width: 14,
                      height: 14,
                      bottom: 0,
                      right: 0,
                      color:
                        consultant.onlineStatus === "online"
                          ? "#7DE882"
                          : consultant.onlineStatus === "busy"
                          ? "#FF820F"
                          : "#C4C4C4",
                    }}
                  />
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: "flex", marginLeft: 3 }}>
            <CircleIcon sx={dotStyles} color="primary" />
            <CircleIcon sx={dotStyles} color="primary" />
            <CircleIcon sx={dotStyles} color="primary" />
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default FavoriteBar;

const top100Films = [
  { title: "headache" },
  { title: "อาเจียน" },
  { title: "คลื่นไส้" },
  { title: "ปวดหัว" },
  { title: "ปวดท้อง" },
  { title: "eye discomfort" },
  { title: "unable to breath" },
];
