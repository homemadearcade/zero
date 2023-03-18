import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ListItemButton, ListItemIcon, ListSubheader } from '@mui/material';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';

export default function NestedList({listItems}) {
  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return <NestedListBody expanded={expanded} onChange={handleChange}></NestedListBody>
}

export function NestedListBody({expanded, onChange, title, children, id, interfaceId}) {
    const isOpen = expanded === id
    const el = <><ListItemButton dense onClick={onChange(id)}>
        <ListItemText primary={title} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>

    if(interfaceId) {
      return <Unlockable key={id} interfaceId={interfaceId}>
        {el}
      </Unlockable>
    } else {
      return el
    }
}

export function NestedListContainer({children, title}) {
  return <List
    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
    aria-labelledby="nested-list-subheader"
    subheader={
      title ? <ListSubheader component="div" id="nested-list-subheader">
        {title}
      </ListSubheader> : null
    }
  >{children}</List>
}

function ColorSquare({color}) {
  if(!color) {
    return <ListItemIcon><div style={{width: '.5rem', height:'.5rem', border: '1px solid white'}}/></ListItemIcon> 
  } else {
    return <ListItemIcon><div style={{width: '.5rem', height:'.5rem', backgroundColor: color}}/></ListItemIcon> 
  }
}

export function NestedListItem({children, title, onClick, color, useColor}) {
  return <ListItemButton dense onClick={onClick} sx={{ pl: '2em' }}>
    {useColor && <ColorSquare color={color}></ColorSquare>}
    {title && <ListItemText primary={title} />}
    {children}
  </ListItemButton>
}

export function NestedListItemButton({children, title, onClick, useColor, color}) {
  return <ListItem dense onClick={onClick} sx={{ pl: '2em' }}>
    {useColor && <ColorSquare color={color}></ColorSquare>}
    {title && <ListItemText primary={title} />}
    {children}
  </ListItem>
}
