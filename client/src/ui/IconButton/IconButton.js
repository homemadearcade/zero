import { IconButton } from '@mui/material';
import React from 'react';
import { getThemePrimaryColor } from '../../utils/webPageUtils';
import Icon from '../Icon/Icon';

import './IconButton.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  return <IconButton {...props} sx={{backgroundColor: getThemePrimaryColor().hexString, width: props.width, height: props.height}}>
      <Icon icon={props.icon}></Icon>
    </IconButton>
};
