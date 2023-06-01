import { Link as MuiLink } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

import React from "react";

const Link = ({newTab, href, to, className, children}) => {
  console.log('Link', {newTab, href, to, className, children})
  return (
    <MuiLink className={className} target={(newTab || href) && '_blank'} rel={(newTab || href) && 'noreferrer'} component={ReactRouterLink} children={children} to={href ? { pathname: href } : to} />
  );
};

export default Link;