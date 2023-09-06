import { Button } from '@mui/material';
import React from 'react'

const CustomButton = ({sx, title = "Button", isButtonDisabled = false, handleButton,  ...props}) => {
    
      
  return (
    <Button 
    disabled={isButtonDisabled}
    onClick={handleButton}
    variant="contained" sx={{  fontSize:'14px' , minWidth:'100px', ...sx}} {...props}>
     {title}
    </Button>
  )
}

export default CustomButton