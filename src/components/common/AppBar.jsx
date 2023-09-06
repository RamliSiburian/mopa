import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';


const AppBarComponent = ({ open, setOpen, title }) => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate('/')

  }
    const isLogin = true;
  return (
    <AppBar
      position="static"
      open={open}
      sx={{
        background: "transparent",
        boxShadow: "0px 1px 4px 0px #AAA",
      }}
    >
      <Toolbar>

        {isLogin ? (
          <Typography
            sx={{
              flexGrow: 1,
              color: "#000",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            Dashboard
          </Typography>
        ) : (
          <Typography
            sx={{
              flexGrow: 1,
              color: "#000",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            MCDA
          </Typography>
        )}
        {!isLogin ? (
          <Button>Login</Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default AppBarComponent