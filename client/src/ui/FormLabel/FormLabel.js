import React from 'react';
import { FormLabel } from '@mui/material';
import './FormLabel.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return (
    <div className="FormLabel">
      <FormLabel {...props}/>
    </div>
  );
};
