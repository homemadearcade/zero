import { IconButton } from '@mui/material';
import React from 'react';
import { useWishTheme } from '../../hooks/useWishTheme';
import Icon from '../Icon/Icon';

import './IconButton.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return <IconButton {...props} sx={{backgroundColor: useWishTheme().hexString, width: props.width, height: props.height, ...props.sx}}>
      <Icon icon={props.icon}>
      </Icon>
      {props.children}
    </IconButton>
};
