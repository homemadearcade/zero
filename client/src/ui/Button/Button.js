import { Button } from '@mui/material';
import React from 'react';

import './Button.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return <Button {...props} sx={{width: props.width, height: props.height}}/>

  return (
    <div className={props.className + " Button"}>
      <Button {...props}/>
    </div>
  );
};
