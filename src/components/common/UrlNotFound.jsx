import { Box, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const UrlNotFound = ({url}) => {
  return (
    <Box sx={{ display:'flex', justifyContent:'center', gap:2, alignItems:'center', height:'100vh', flexDirection:'column' }}>
        <Typography sx={{ fontSize:'24px', fontWeight:600 }}>Halaman tidak ditemukan</Typography>
        <Typography sx={{ fontSize:'16px' }}><Link to={url}>Kembali ke dashboard</Link> </Typography>
    </Box>
  )
}

export default UrlNotFound