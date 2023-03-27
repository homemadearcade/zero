import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  // [`& ${treeItemClasses.iconContainer}`]: {
  //   display: 'none !important',
  // },
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function IconTreeNode(props) {
  const {
    bgColor,
    color,
    labelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
          <Box color="inherit" sx={{ mr: 1 }}>{labelIcon}</Box>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}

IconTreeNode.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default function IconTree({nodes}) {
  return (
    <TreeView
      aria-label="icon tree"
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {nodes.map(({icon, id, label, children, onClick}) => {
        return <IconTreeNode key={id} nodeId={id} onClick={onClick} labelText={label} labelIcon={icon}>
          {children?.map(({icon, id, label, onClick, children}) => {
            return <IconTreeNode
             key={id}
              nodeId={id}
              onClick={onClick}
              labelText={label}
              labelIcon={icon}
              color="#1a73e8"
              bgColor="#e8f0fe"
            >
              {children?.map(({icon, label, onClick, id}) => {
                return <IconTreeNode
                 key={id}
                  nodeId={id}
                  onClick={onClick}
                  labelText={label}
                  labelIcon={icon}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                >
                
                </IconTreeNode>}
              )}
            </IconTreeNode>
        })}</IconTreeNode>
      })}
    </TreeView>
  );
}