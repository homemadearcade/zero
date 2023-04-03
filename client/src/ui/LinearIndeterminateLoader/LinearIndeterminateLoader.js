import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './LinearIndeterminateLoader.scss'

export default function LinearIndeterminateLoader({}) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box> 
  );
}