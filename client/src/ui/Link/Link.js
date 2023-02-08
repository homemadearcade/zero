import { Link as MuiLink } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import './Link.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {

  if(props.to && props.href) {
    console.error('link has both to and href, bad!')
    return null
  }

  if(props.to) {
    if(props.ignoreDefaultStyle) {
      return <RouterLink to={props.to}>{props.children}</RouterLink>
    }

    return (
      <RouterLink to={props.to}>
        <MuiLink component="span" {...props}/>
      </RouterLink>
    );
  } else if(props.href) {
    // eslint-disable-next-line react/jsx-no-target-blank
    return <a href={props.href} target={props.newTab && '_blank'} rel={props.newTab && 'noreferrer'}>
      <MuiLink className={props.className} component="span">
        {props.children}
      </MuiLink>
    </a>
  }
};
