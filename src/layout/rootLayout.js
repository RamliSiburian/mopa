import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { API, setAuthToken } from '../config/API';

const RootLayout = () => {
  const navigate = useNavigate();
  const checkUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const response = await API.get('/check-auth');
      let payload = response.data.data;
      payload.token = localStorage.token;

      // navigate('/dashboard');
    } catch (error) {
      navigate('/');
      // if (error.response.data.code === 401) {
      // }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default RootLayout;
