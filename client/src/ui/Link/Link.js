import { Link as MuiLink } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

import React from "react";

const Link = props => {
  return (
    <MuiLink {...props} target={(props.newTab || props.href) && '_blank'} rel={(props.newTab || props.href) && 'noreferrer'} component={ReactRouterLink} to={props.href ? { pathname: props.href } : props.to} />
  );
};

export default Link;