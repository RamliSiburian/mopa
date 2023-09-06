import { Backdrop, Box, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import CustomInput from "./atoms/CustomInput";

const ModalRegister = ({ register, setRegister, setOpen }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log({ userName });
    console.log({ password });
  };

  const handleLogin = () => {
    setOpen(true);
    setRegister(false);
  };

  return (
    <Backdrop open={register}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            maxWidth: "360px",
            background: "rgba(255,255,255 , .5)",
            padding: "32px",
            borderRadius: "8px 0px 0px 8px",
            boxShadow: "0 0 1rem 0 rgba(0, 0, 0, .2)",
            backdropFilter: " blur(5px)",
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              mb: 2,
              letterSpacing: "1px",
            }}
          >
            Register
          </Typography>
          <Divider />

          <Grid container columns={12} spacing={3}>
            <Grid item xs={12}>
              <CustomInput
                label="Username"
                variant="filled"
                sx={{
                  width: "100%",
                  bgcolor: "rgba(255,255,255, .3)",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                value={userName}
                setValue={setUserName}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomInput
                label="Password"
                type="password"
                variant="filled"
                sx={{
                  width: "100%",
                  bgcolor: "rgba(255,255,255, .3)",
                  fontSize: "14px",
                  borderRadius: "4px",
                  color: "#000",
                }}
                value={password}
                setValue={setPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                fullWidth
                onClick={handleRegister}
                sx={{
                  mt: 2,
                  background: "#B11312",
                  textAlign: "center",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "#FFF",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  cursor: "pointer",
                }}
              >
                Register
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            maxWidth: "360px",
            width: "250px",
            background: "rgba(179,19,18, .5)",
            padding: "32px",
            borderRadius: "0px 8px 8px 0px",
            boxShadow: "0 0 1rem 0 rgba(0, 0, 0, .2)",
            backdropFilter: " blur(5px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{ fontSize: "14px", textAlign: "justify", color: "#FAFAFA" }}
            >
              Model Optimisasi Multi Criteria Decision Analysis Untuk
              Perencanaan Smart Wisata Syariah.
            </Typography>
          </Box>
          <Box
            sx={{
              minWidth: "75px",
              border: "1px solid #FAFAFA",
              borderRadius: "8px",
              padding: "6px 16px",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={handleLogin}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#FAFAFA",
                letterSpacing: "2px",
                fontWeight: 600,
              }}
            >
              LOGIN
            </Typography>
          </Box>
        </Box>
      </Box>
    </Backdrop>
  );
};
export default ModalRegister;
