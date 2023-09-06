import { Box, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const DataMaster = () => {
  return (
    <Box>
      <Typography>testa data master</Typography>
      <Outlet />
    </Box>
  );
};

export default DataMaster;
