import { Box, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import React from 'react'
import { CheckIcon, CloseIcon } from '../../assets/icons'
import CustomButton from './atoms/CustomButton'

const CustomDialogSave = ({open,  setOpen, handleSave}) => {
  return (
    <Dialog
    open={open}
    onClose={() =>setOpen(!open)}
    >
      <DialogTitle>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', minWidth:'156px', maxWidth:'300px' }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
          <Box sx={{ width:'32px', height:'32px', background:'rgba(81, 177, 92, .1)' , borderRadius:'100px', display:'flex', justifyContent:'center', alignItems:'center'}}><CheckIcon sx={{ fontSize:'20px' }} /> </Box>
          <Typography> Save</Typography>
          </Box>
          <CloseIcon onClick={() =>setOpen(!open)} sx={{ cursor:'pointer', color:'#F33A3A' }}/>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ minWidth:'156px', maxWidth:'300px' }}>
        <Typography sx={{ fontSize:'14px' }}>
          Apakah anda sudah memastikan bahwa data yang di input sudah benar ?
        </Typography>

        <Box sx={{ display:'flex', alignItems:'center', gap:2 , justifyContent:'flex-end', mt:3}}>
          <Typography sx={{ color : '#9E9D9D', cursor:'pointer', fontSize:'14px'}} onClick={() => setOpen(!open)}>Cancle</Typography>
          <CustomButton title='Save' color="success" variant="contained" sx={{ fontSize:'14px' }} handleButton={handleSave}/>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialogSave