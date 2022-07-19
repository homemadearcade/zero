import { Typography } from '@mui/material';
import React from 'react';

import './Typography.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return (
    <div className="Typography">
      <Typography {...props}/>
    </div>
  );
};
