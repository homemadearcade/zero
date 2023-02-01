import { IconButton } from '@mui/material';
import React from 'react';
import Icon from '../Icon/Icon';

import './IconButton.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return <IconButton {...props} sx={{backgroundColor: 'rgb(144, 202, 249, 0.4)', width: props.width, height: props.height}}>
      <Icon icon={props.icon}></Icon>
    </IconButton>
};
