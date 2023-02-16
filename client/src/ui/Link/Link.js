import { Link as MuiLink } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

import React from "react";

const Link = props => {
  return (
    <MuiLink {...props} target={props.newTab && '_blank'} rel={props.newTab && 'noreferrer'} component={ReactRouterLink} href={props.href ?? "#"} to={props.to ? props.to : (props.href ?? "#")} />
  );
};

export default Link;