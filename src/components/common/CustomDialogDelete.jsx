import React from 'react'
import { CloseIcon, DeleteIcon } from '../../assets/icons'
import { Box, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import CustomButton from './atoms/CustomButton'

const CustomDialogDelete = ({open,  setOpen, handleDelete, dataToDelete, errorMessage}) => {
  return (
    <Dialog
    open={open}
    onClose={() =>setOpen(!open)}
    >
      <DialogTitle>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', minWidth:'156px', maxWidth:'300px' }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
          <Box sx={{ width:'32px', height:'32px', background:'rgba(243,58, 58, .1)' , borderRadius:'100px', display:'flex', justifyContent:'center', alignItems:'center'}}><DeleteIcon sx={{ fontSize:'20px', color:'#F33A3A' }} /> </Box>
          <Typography> Delete</Typography>
          </Box>
          <CloseIcon onClick={() =>setOpen(!open)} sx={{ cursor:'pointer' }}/>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ minWidth:'156px', maxWidth:'300px' }}>
        <Typography sx={{ fontSize:'14px' }}>
          Apakah anda yakin akan menghapus data {dataToDelete} ?
        </Typography>
        <Typography sx={{ color:'#F33A3A', fontSize:'12px' }}>{errorMessage && errorMessage}</Typography>


        <Box sx={{ display:'flex', alignItems:'center', gap:2 , justifyContent:'flex-end', mt:3}}>
          <Typography sx={{ color : '#9E9D9D', cursor:'pointer', fontSize:'14px'}} onClick={() => setOpen(!open)}>Cancle</Typography>
          <CustomButton title='Delete' color="error" variant="contained" sx={{ fontSize:'14px' }} handleButton={handleDelete}/>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialogDelete