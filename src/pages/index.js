import { Box } from "@mui/material";
import React, { useState } from "react";
import Background from "../assets/images/background.jpg";
import ModalLogin from "../components/common/Login";
import ModalRegister from "../components/common/Register";

const Home = () => {
  const [open, setOpen] = useState(true);
  const [register, setRegister] = useState(false);
  return (
    <Box
      sx={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        transition: "all 3s",
      }}
    >
      <ModalLogin {...{ open, setOpen, setRegister }} />
      <ModalRegister {...{ register, setRegister, setOpen }} />
    </Box>
  );
};

export default Home;
