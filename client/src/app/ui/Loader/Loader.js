import { Typography } from '@mui/material';
import React from 'react';

import './styles.css';

const Loader = (props) => {
  return (
    <div className="loader-container loader" {...props}>
      <Typography component="h3" variant="h3">{props.text || 'Loading..'}</Typography>
    </div>
  );
};

export default Loader;
