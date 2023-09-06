import { TextField, useTheme } from '@mui/material'
import React from 'react'

const CustomInput = ({value, setValue , error, sx,   ...props}) => {
  const theme = useTheme()
  return (

    <TextField
      value={value}
      label="Input Form"
      variant='filled'
      onChange={(e) => setValue(e.target.value)}
      error={error}
      {...props}
      sx={{
        width:'100%',
        '.MuiInputLabel-root': {
          lineHeight: 1.5,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          boxShadow: error && `0 0 4px ${theme.palette.error.main}`,
        },
        '& .Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            boxShadow: error && `0 0 8px ${theme.palette.error.main}`,
          },
        },
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            boxShadow: error && `0 0 8px ${theme.palette.error.main}`,
          },
        },
        ...sx,
      }}
      {...props}
    />
    
    
  )
}

export default CustomInput