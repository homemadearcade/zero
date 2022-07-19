import { Button } from '@mui/material';
import React from 'react';

import './Button.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return (
    <div className="Button">
      <Button{...props}/>
    </div>
  );
};
