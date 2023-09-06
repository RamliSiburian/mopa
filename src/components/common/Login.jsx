import { Backdrop, Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomInput from './atoms/CustomInput';
import { useDispatch } from "react-redux";
import { changeIsLogin } from '../../store/auth';
import { API } from '../../config/API';


const  ModalLogin = ({ open, setOpen, setRegister }) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const dispacth = useDispatch();
    const navigate = useNavigate();
    const [errorLogin, setErrorLogin] = useState('')
  
    const handleLogin = async() => {
      const params = {}
      params.username = userName
      params.password = password

      try {
        const dataLogin = await API.post("/login", params);
        localStorage.setItem("token",dataLogin.data.data.token);
              navigate("/dashboard");
      } catch (err) {
        console.error(err);
        setErrorLogin('username atau password tidak sesuai')
      }finally{
        setTimeout(() => setErrorLogin(''),  3000);
      }
      // dispacth(changeIsLogin(true));

    };
  
    const handleRegister = () => {
      setOpen(false);
      setRegister(true);
    };
  
  return (
    <Backdrop open={open}>
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          maxWidth: "360px",
          width: "250px",
          background: "rgba(179,19,18, .5)",
          padding: "32px",
          borderRadius: "8px 0px 0px 8px",
          boxShadow: "0 0 1rem 0 rgba(0, 0, 0, .5)",
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
          onClick={handleRegister}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "#FAFAFA",
              letterSpacing: "2px",
              fontWeight: 600,
            }}
          >
            REGISTER
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: "360px",
          background: "rgba(255,255,255 , .5)",
          padding: "32px",
          borderRadius: "0px 8px 8px 0px",
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
          Login
        </Typography>
        {errorLogin &&
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            mb: 2,
            letterSpacing: "1px",
            background:'rgba(255,0,0 , .6)',
            borderRadius:'4px',
            p:1,
            color:'#FFF',
            animation:'ease-in',
            animationDuration: '5s',
            transition:'ease-in 5s'
            }}
        >
           {errorLogin}
        </Typography>
          }

        

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
                borderRadius: "4px",
                fontSize: "14px",
              }}
              value={password}
              setValue={setPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              fullWidth
              onClick={handleLogin}
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
              Login
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Backdrop>
  )
}

export default ModalLogin