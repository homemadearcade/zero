import { Link as MuiLink } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import './Link.scss';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const propers = {...props}
  const newTab = propers.newTab
  delete propers.newTab

  if(propers.to && propers.href) {
    console.error('link has both to and href, bad!')
    return null
  }

  if(propers.to) {
    if(propers.ignoreDefaultStyle) {
      return <RouterLink to={propers.to}>{propers.children}</RouterLink>
    }

    return (
      <RouterLink to={propers.to}>
        <MuiLink component="span" {...propers}/>
      </RouterLink>
    );
  } else if(propers.href) {
    // eslint-disable-next-line react/jsx-no-target-blank
    return <MuiLink target={newTab && '_blank'} rel={newTab && 'noreferrer'} {...propers}/>
  }
};
